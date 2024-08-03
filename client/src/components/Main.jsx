import React, { useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import { useRouter } from "next/navigation";
import { useStateValue } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";
import SearchMessages from "./Chat/SearchMessages";
import VideoCall from "./Call/VideoCall";
import VoiceCall from "./Call/VoiceCall";
import IncomingCall from "./common/IncomingCall";
import IncomingVideoCall from "./common/IncomingVideoCall";

function Main() {
  const router = useRouter();
  const socketRef = useRef();
  const [
    {
      userInfo,
      currentChatUser,
      messagesSearch,
      videoCall,
      voiceCall,
      incomingVoiceCall,
      incomingVideoCall,
    },
    dispatch,
  ] = useStateValue();
  const [redirectLogin, setredirectLogin] = useState(false);
  const [socketevent, setsocketevent] = useState(false);

  useEffect(() => {
    if (redirectLogin) {
      router.push("/login");
    }
  }, [redirectLogin,router]);

  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser) {
      setredirectLogin(true);
    }
    if (!userInfo && currentUser?.email) {
      const { data } = await axios.post(CHECK_USER_ROUTE, {
        email: currentUser.email,
      });

      if (!data.status) {
        router.push("/login");
      }else{
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            id: data.data?.id,
            name: data.data.name,
            email: data.data.email,
            profileImage: data.data.profileImage,
            status: data.data.status,
          },
        });
      }
    }
  });

  useEffect(() => {
    if (!socketevent && socketRef.current) {
      socketRef.current.on("msg-receive", (data) => {
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...data.message,
          },
        });
      });

      socketRef.current.on(
        "incoming-voice-call",
        ({ from, roomId, callType }) => {
          dispatch({
            type: reducerCases.SET_INCOMING_VOICE_CALL,
            incomingVoiceCall: {
              ...from,
              roomId,
              callType,
            },
          });
        }
      );

      socketRef.current.on(
        "incoming-video-call",
        ({ from, roomId, callType }) => {
        
          dispatch({
            type: reducerCases.SET_INCOMING_VIDEO_CALL,
            incomingVideoCall: {
              ...from,
              roomId,
              callType,
            },
          });
        }
      );

      socketRef.current.on("reject-voice-call", ({}) => {
        dispatch({
          type: reducerCases.END_CALL,
        });
      });


      socketRef.current.on("reject-video-call", ({}) => {
        dispatch({
          type: reducerCases.END_CALL,
        });
      });

      socketRef.current.on("online-users", ({onlineUsers}) => {
        dispatch({
          type: reducerCases.SET_ONLINE_USERS,onlineUsers
        });
      });

  
      setsocketevent(true);
    }
  }, [socketRef.current]);

  useEffect(() => {
    if (userInfo) {
      socketRef.current = io(HOST);
      socketRef.current.emit("add-user", userInfo.id);
      dispatch({
        type: reducerCases.SET_SOCKET,
        socketRef,
      });
    }
  }, [userInfo]);

  useEffect(() => {
    const getmessages = async () => {
      const {
        data: { messages },
      } = await axios.get(
        `${GET_MESSAGES_ROUTE}/${userInfo.id}/${currentChatUser.id}`
      );

      dispatch({
        type: reducerCases.SET_MESSAGES,
        messages,
      });
    };
    if (currentChatUser?.id) {
      getmessages();
    }
  }, [currentChatUser]);

  return (
    <>
{
  incomingVideoCall && <IncomingVideoCall />
}
{
  incomingVoiceCall && <IncomingCall />
}

      {videoCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden ">
          <VideoCall />
        </div>
      )}
      {voiceCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden ">
          <VoiceCall />
        </div>
      )}
      {!videoCall && !voiceCall && (
        <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
          <ChatList />
          {currentChatUser ? (
            <div
              className={messagesSearch ? "grid grid-cols-2" : "grid-cols-2"}
            >
              <Chat />
              {messagesSearch && <SearchMessages />}{" "}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      )}
    </>
  );
}

export default Main;




// import React, { useEffect, useRef, useState } from "react";
// import ChatList from "./Chatlist/ChatList";
// import Empty from "./Empty";
// import { onAuthStateChanged } from "firebase/auth";
// import { firebaseAuth } from "@/utils/FirebaseConfig";
// import axios from "axios";
// import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
// import { useRouter } from "next/navigation";
// import { useStateValue } from "@/context/StateContext";
// import { reducerCases } from "@/context/constants";
// import Chat from "./Chat/Chat";
// import { io } from "socket.io-client";
// import SearchMessages from "./Chat/SearchMessages";
// import VideoCall from "./Call/VideoCall";
// import VoiceCall from "./Call/VoiceCall";
// import IncomingCall from "./common/IncomingCall";
// import IncomingVideoCall from "./common/IncomingVideoCall";

// function Main() {
//   const router = useRouter();
//   const socketRef = useRef();
//   const [
//     {
//       userInfo,
//       currentChatUser,
//       messagesSearch,
//       videoCall,
//       voiceCall,
//       incomingVoiceCall,
//       incomingVideoCall,
//     },
//     dispatch,
//   ] = useStateValue();
//   const [redirectLogin, setRedirectLogin] = useState(false);
//   const [socketEvent, setSocketEvent] = useState(false);

//   useEffect(() => {
//     if (redirectLogin) {
//       router.push("/login");
//     }
//   }, [redirectLogin, router]);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
//       if (!currentUser) {
//         setRedirectLogin(true);
//       } else if (!userInfo && currentUser?.email) {
//         const { data } = await axios.post(CHECK_USER_ROUTE, {
//           email: currentUser.email,
//         });

//         if (!data.status) {
//           router.push("/login");
//         } else {
//           dispatch({
//             type: reducerCases.SET_USER_INFO,
//             userInfo: {
//               id: data.data?.id,
//               name: data.data.name,
//               email: data.data.email,
//               profileImage: data.data.profileImage,
//               status: data.data.status,
//             },
//           });
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, [userInfo, dispatch, router]);

//   useEffect(() => {
//     if (!socketEvent && socketRef.current) {
//       socketRef.current.on("msg-receive", (data) => {
//         dispatch({
//           type: reducerCases.ADD_MESSAGE,
//           newMessage: {
//             ...data.message,
//           },
//         });
//       });

//       socketRef.current.on("incoming-voice-call", ({ from, roomId, callType }) => {
//         dispatch({
//           type: reducerCases.SET_INCOMING_VOICE_CALL,
//           incomingVoiceCall: {
//             ...from,
//             roomId,
//             callType,
//           },
//         });
//       });

//       socketRef.current.on("incoming-video-call", ({ from, roomId, callType }) => {
//         dispatch({
//           type: reducerCases.SET_INCOMING_VIDEO_CALL,
//           incomingVideoCall: {
//             ...from,
//             roomId,
//             callType,
//           },
//         });
//       });

//       socketRef.current.on("reject-voice-call", () => {
//         dispatch({
//           type: reducerCases.END_CALL,
//         });
//       });

//       socketRef.current.on("reject-video-call", () => {
//         dispatch({
//           type: reducerCases.END_CALL,
//         });
//       });

//       socketRef.current.on("online-users", ({ onlineUsers }) => {
//         dispatch({
//           type: reducerCases.SET_ONLINE_USERS,
//           onlineUsers,
//         });
//       });

//       setSocketEvent(true);
//     }
//   }, [socketEvent, dispatch]);

//   useEffect(() => {
//     if (userInfo) {
//       socketRef.current = io(HOST);
//       socketRef.current.emit("add-user", userInfo.id);
//       dispatch({
//         type: reducerCases.SET_SOCKET,
//         socketRef,
//       });
//     }
//   }, [userInfo, dispatch]);

//   useEffect(() => {
//     const getMessages = async () => {
//       const {
//         data: { messages },
//       } = await axios.get(`${GET_MESSAGES_ROUTE}/${userInfo.id}/${currentChatUser.id}`);

//       dispatch({
//         type: reducerCases.SET_MESSAGES,
//         messages,
//       });
//     };
//     if (currentChatUser?.id) {
//       getMessages();
//     }
//   }, [currentChatUser, userInfo?.id, dispatch]);

//   return (
//     <>
//       {incomingVideoCall && <IncomingVideoCall />}
//       {incomingVoiceCall && <IncomingCall />}
//       {videoCall ? (
//         <div className="h-screen w-screen max-h-full overflow-hidden">
//           <VideoCall />
//         </div>
//       ) : voiceCall ? (
//         <div className="h-screen w-screen max-h-full overflow-hidden">
//           <VoiceCall />
//         </div>
//       ) : (
//         <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
//           <ChatList />
//           {currentChatUser ? (
//             <div className={messagesSearch ? "grid grid-cols-2" : "grid-cols-2"}>
//               <Chat />
//               {messagesSearch && <SearchMessages />}
//             </div>
//           ) : (
//             <Empty />
//           )}
//         </div>
//       )}
//     </>
//   );
// }

// export default Main;
