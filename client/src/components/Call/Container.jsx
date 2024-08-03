import { reducerCases } from "@/context/constants";
import { useStateValue } from "@/context/StateContext";
import { GET_CALL_TOKEN } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";

function Container({ data }) {
  const [{ userInfo, socketRef, videoCall, voiceCall }, dispatch] =
    useStateValue();
  const [callAccepted, setCallAccepted] = useState(false);
  const [token, setToken] = useState(undefined);
  const [zgVar, setzgVar] = useState(undefined);
  const [localStream, setlocalStream] = useState(undefined);
  const [publishStream, setpublishStream] = useState(undefined);

  useEffect(() => {
    if (data.type === "out-going") {
      socketRef.current.on("accept-call", () => setCallAccepted(true));
    } else {
      setTimeout(() => {
        setCallAccepted(true);
      }, 1000);
    }
  }, [data]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const {
          data: { token: rtoken },
        } = await axios.get(`${GET_CALL_TOKEN}/${userInfo.id}`);
        setToken(rtoken);
      } catch (error) {
        console.log(error);
      }
    };

    getToken();
  }, [callAccepted]);

  useEffect(() => {
    const startCall = async () => {
      import("zego-express-engine-webrtc").then(
        async ({ ZegoExpressEngine }) => {
          const zg = new ZegoExpressEngine(
            parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID),
            process.env.NEXT_PUBLIC_ZEGO_SERVER_ID
          );
          setzgVar(zg);

          zg.on(
            "roomStreamUpdate",
            async (roomID, updateType, streamList, extendedData) => {
              if (updateType === "ADD") {
                const rmVideo = document.getElementById("remote-video");
                const vd = document.createElement(
                  data.callType === "video" ? "video" : "audio"
                );
                vd.id = streamList[0].streamID;
                vd.autoplay = true;
                vd.playsInline = true;
                vd.muted = false;
                if (rmVideo) {
                  rmVideo.appendChild(vd);
                }
                zg.startPlayingStream(streamList[0].streamID, {
                  audio: true,
                  video: true,
                }).then((stream) => (vd.srcObject = stream));
              } else if (
                updateType === "DELETE" &&
                zg &&
                localStream &&
                streamList[0].streamID
              ) {
                zg.destroyStream(localStream);
                zg.stopPublishingStream(streamList[0].streamID);
                zg.logoutRoom(data.roomId.toString());
                dispatch({
                  type: reducerCases.END_CALL,
                });
              }
            }
          );
          await zg.loginRoom(
            data.roomId.toString(),
            token,
            { userID: userInfo.id.toString(), userName: userInfo.name },
            { userUpdate: true }
          );

          const localStream = await zg.createStream({
            camers: {
              audio: true,
              video: data.callType === "video" ? true : false,
            },
          });

          const localVideo = document.getElementById("local-audio");
          const videoElemenet = document.createElement(
            data.callType === "video" ? "video" : "audio"
          );
          videoElemenet.id = "video-local-zego";
          videoElemenet.className = "h-16 w-24";
          videoElemenet.autoplay = true;
          videoElemenet.muted = false;
          videoElemenet.playsInline = true;
    
          localVideo.appendChild(videoElemenet);
          const td = document.getElementById("video-local-zego");
          td.srcObject = localStream;
          const streamID = "123" + Date.now();
          setpublishStream(streamID);
          setlocalStream(localStream);
          zg.startPublishingStream(streamID, localStream);
          
        }
      );
      

      
      
    };
    if (token) {
      startCall();
    }
  }, [token]);

  const endCall = () => {
    const id = data.id;
    if (zgVar && localStream && publishStream) {
      zgVar.destroyStream(localStream);
      zgVar.stopPublishingStream(publishStream);
      zgVar.logoutRoom(data.roomId.toString());
    }
    if (data.callType === "voice") {
      socketRef.current.emit("reject-voice-call", { from: id });
    } else {
      socketRef.current.emit("reject-video-call", { from: id });
    }
    dispatch({ type: reducerCases.END_CALL });
  };

  useEffect(() => {
    socketRef.current.on("video-call-rejected", (data) => {
      dispatch({ type: reducerCases.END_CALL });
    });
    socketRef.current.on("voice-call-rejected", (data) => {
      dispatch({ type: reducerCases.END_CALL });
    });

    return () => {
      socketRef.current.off("video-call-rejected");
      socketRef.current.off("voice-call-rejected");
    };
  }, []);

  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white ">
      <div className="flex flex-col gap-3 items-center ">
        <span className="text-5xl">{data.name}</span>
        <span className="text-lg">
          {callAccepted && data.callType !== "video"
            ? "On Going Call"
            : "Calling"}
        </span>
      </div>
      {(data.callType === "audio") && (
        <div className="my-24">
          <Image
            src={data.profileImage}
            alt="avatar"
            width={300}
            height={300}
            className="rounded-full"
          />
        </div>
      )}
      <div className="my-5 relative  " id="remote-video">
      <div className="absolute bottom-5 right-5" id="local-audio"></div>
      </div>
      <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full ">
        <MdOutlineCallEnd
          className="text-3xl cursor-pointer "
          onClick={endCall}
        />
      </div>
    </div>
  );
}

export default Container;

// import { reducerCases } from "@/context/constants";
// import { useStateValue } from "@/context/StateContext";
// import { GET_CALL_TOKEN } from "@/utils/ApiRoutes";
// import axios from "axios";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import { MdOutlineCallEnd } from "react-icons/md";

// function Container({ data }) {
//   const [{ userInfo, socketRef, videoCall, voiceCall }, dispatch] =
//     useStateValue();
//   const [callAccepted, setCallAccepted] = useState(false);
//   const [token, setToken] = useState(undefined);
//   const [zgVar, setzgVar] = useState(undefined);
//   const [localStream, setlocalStream] = useState(undefined);
//   const [publishStream, setpublishStream] = useState(undefined);

//   useEffect(() => {
//     if (data.type === "out-going") {
//       socketRef.current.on("accept-call", () => setCallAccepted(true));
//     } else {
//       setTimeout(() => {
//         setCallAccepted(true);
//       }, 1000);
//     }
//   }, [data, socketRef]);

//   useEffect(() => {
//     const getToken = async () => {
//       try {
//         const { data: { token: rtoken } } = await axios.get(`${GET_CALL_TOKEN}/${userInfo.id}`);
//         setToken(rtoken);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     getToken();
//   }, [callAccepted, userInfo.id]);

//   useEffect(() => {
//     const startCall = async () => {
//       import("zego-express-engine-webrtc").then(
//         async ({ ZegoExpressEngine }) => {
//           const zg = new ZegoExpressEngine(
//             parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID),
//             process.env.NEXT_PUBLIC_ZEGO_SERVER_ID
//           );
//           setzgVar(zg);

//           zg.on(
//             "roomStreamUpdate",
//             async (roomID, updateType, streamList) => {
//               if (updateType === "ADD") {
//                 const rmVideo = document.getElementById("remote-video");
//                 const vd = document.createElement(data.callType === "video" ? "video" : "audio");
//                 vd.id = streamList[0].streamID;
//                 vd.autoplay = true;
//                 vd.playsInline = true;
//                 vd.muted = false;
//                 if (rmVideo) {
//                   rmVideo.appendChild(vd);
//                 }
//                 zg.startPlayingStream(streamList[0].streamID, {
//                   audio: true,
//                   video: data.callType === "video",
//                 }).then((stream) => (vd.srcObject = stream));
//               } else if (updateType === "DELETE" && zg && localStream && streamList[0].streamID) {
//                 zg.destroyStream(localStream);
//                 zg.stopPublishingStream(streamList[0].streamID);
//                 zg.logoutRoom(data.roomId.toString());
//                 dispatch({ type: reducerCases.END_CALL });
//               }
//             }
//           );

//           await zg.loginRoom(data.roomId.toString(), token, {
//             userID: userInfo.id.toString(),
//             userName: userInfo.name,
//           }, { userUpdate: true });

//           const localStream = await zg.createStream({
//             camera: {
//               audio: true,
//               video: data.callType === "video",
//             },
//           });

//           const localVideo = document.getElementById("local-audio");
//           const videoElement = document.createElement(data.callType === "video" ? "video" : "audio");
//           videoElement.id = "video-local-zego";
//           videoElement.className = "h-28 w-32";
//           videoElement.autoplay = true;
//           videoElement.muted = false;
//           videoElement.playsInline = true;

//           localVideo.appendChild(videoElement);
//           videoElement.srcObject = localStream;

//           const streamID = "123" + Date.now();
//           setpublishStream(streamID);
//           setlocalStream(localStream);
//           zg.startPublishingStream(streamID, localStream);
//         }
//       );
//     };

//     if (token) {
//       startCall();
//     }
//   }, [token, data.callType, data.roomId, dispatch, userInfo.id, userInfo.name]);

//   const endCall = () => {
//     const id = data.id;
//     if (zgVar && localStream && publishStream) {
//       zgVar.destroyStream(localStream);
//       zgVar.stopPublishingStream(publishStream);
//       zgVar.logoutRoom(data.roomId.toString());
//     }
//     if (data.callType === "voice") {
//       socketRef.current.emit("reject-voice-call", { from: id });
//     } else {
//       socketRef.current.emit("reject-video-call", { from: id });
//     }
//     dispatch({ type: reducerCases.END_CALL });
//   };

//   useEffect(() => {
//     socketRef.current.on("video-call-rejected", () => {
//       dispatch({ type: reducerCases.END_CALL });
//     });
//     socketRef.current.on("voice-call-rejected", () => {
//       dispatch({ type: reducerCases.END_CALL });
//     });

//     return () => {
//       socketRef.current.off("video-call-rejected");
//       socketRef.current.off("voice-call-rejected");
//     };
//   }, [socketRef, dispatch]);

//   return (
//     <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white">
//       <div className="flex flex-col gap-3 items-center">
//         <span className="text-5xl">{data.name}</span>
//         <span className="text-lg">
//           {callAccepted && data.callType !== "video" ? "On Going Call" : "Calling"}
//         </span>
//       </div>
//       {(!callAccepted || data.callType === "audio") && (
//         <div className="my-24">
//           <Image src={data.profileImage} alt="avatar" width={300} height={300} className="rounded-full" />
//         </div>
//       )}
//       <div className="my-5 relative" id="remote-video">
//         <div className="absolute bottom-5 right-5" id="local-audio"></div>
//       </div>
//       <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full">
//         <MdOutlineCallEnd className="text-3xl cursor-pointer" onClick={endCall} />
//       </div>
//     </div>
//   );
// }

// export default Container;

// import { reducerCases } from "@/context/constants";
// import { useStateValue } from "@/context/StateContext";
// import { GET_CALL_TOKEN } from "@/utils/ApiRoutes";
// import axios from "axios";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import { MdOutlineCallEnd } from "react-icons/md";

// function Container({ data }) {
//   const [{ userInfo, socketRef, videoCall, voiceCall }, dispatch] = useStateValue();
//   const [callAccepted, setCallAccepted] = useState(false);
//   const [token, setToken] = useState(undefined);
//   const [zgVar, setzgVar] = useState(undefined);
//   const [localStream, setlocalStream] = useState(undefined);
//   const [publishStream, setpublishStream] = useState(undefined);

//   const APP_ID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID, 10);
//   const SERVER_ID = process.env.NEXT_PUBLIC_ZEGO_SERVER_ID;

//   if (!APP_ID || !SERVER_ID) {
//     console.error("Zego app ID and server ID must be set in environment variables");
//     return null;
//   }

//   useEffect(() => {
//     if (data.type === "out-going") {
//       socketRef.current.on("accept-call", () => setCallAccepted(true));
//     } else {
//       setTimeout(() => {
//         setCallAccepted(true);
//       }, 1000);
//     }
//   }, [data, socketRef]);

//   useEffect(() => {
//     const getToken = async () => {
//       try {
//         const { data: { token: rtoken } } = await axios.get(`${GET_CALL_TOKEN}/${userInfo.id}`);
//         setToken(rtoken);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     if (callAccepted) {
//       getToken();
//     }
//   }, [callAccepted, userInfo.id]);

//   useEffect(() => {
//     const startCall = async () => {
//       try {
//         const { ZegoExpressEngine } = await import("zego-express-engine-webrtc");
//         const zg = new ZegoExpressEngine(APP_ID, SERVER_ID);
//         setzgVar(zg);

//         zg.on("roomStreamUpdate", async (roomID, updateType, streamList) => {
//           if (updateType === "ADD") {
//             const rmVideo = document.getElementById("remote-video");
//             const vd = document.createElement(data.callType === "video" ? "video" : "audio");
//             vd.id = streamList[0].streamID;
//             vd.autoplay = true;
//             vd.playsInline = true;
//             vd.muted = false;
//             if (rmVideo) {
//               rmVideo.appendChild(vd);
//             }
//             const stream = await zg.startPlayingStream(streamList[0].streamID, {
//               audio: true,
//               video: data.callType === "video",
//             });
//             vd.srcObject = stream;
//           } else if (updateType === "DELETE" && zg && localStream && streamList[0].streamID) {
//             zg.destroyStream(localStream);
//             zg.stopPublishingStream(streamList[0].streamID);
//             zg.logoutRoom(data.roomId.toString());
//             dispatch({ type: reducerCases.END_CALL });
//           }
//         });

//         await zg.loginRoom(data.roomId.toString(), token, {
//           userID: userInfo.id.toString(),
//           userName: userInfo.name,
//         }, { userUpdate: true });

//         const localStream = await zg.createStream({
//           camera: {
//             audio: true,
//             video: data.callType === "video",
//           },
//         });

//         const localVideo = document.getElementById("local-audio");
//         const videoElement = document.createElement(data.callType === "video" ? "video" : "audio");
//         videoElement.id = "video-local-zego";
//         videoElement.className = "h-28 w-32";
//         videoElement.autoplay = true;
//         videoElement.muted = false;
//         videoElement.playsInline = true;

//         localVideo.appendChild(videoElement);
//         videoElement.srcObject = localStream;

//         const streamID = "123" + Date.now();
//         setpublishStream(streamID);
//         setlocalStream(localStream);
//         zg.startPublishingStream(streamID, localStream);
//       } catch (error) {
//         console.error("Error initializing Zego Express Engine:", error);
//       }
//     };

//     if (token) {
//       startCall();
//     }
//   }, [token, data.callType, data.roomId, dispatch, userInfo.id, userInfo.name]);

//   const endCall = () => {
//     const id = data.id;
//     if (zgVar && localStream && publishStream) {
//       zgVar.destroyStream(localStream);
//       zgVar.stopPublishingStream(publishStream);
//       zgVar.logoutRoom(data.roomId.toString());
//     }
//     if (data.callType === "voice") {
//       socketRef.current.emit("reject-voice-call", { from: id });
//     } else {
//       socketRef.current.emit("reject-video-call", { from: id });
//     }
//     dispatch({ type: reducerCases.END_CALL });
//   };

//   useEffect(() => {
//     socketRef.current.on("video-call-rejected", () => {
//       dispatch({ type: reducerCases.END_CALL });
//     });
//     socketRef.current.on("voice-call-rejected", () => {
//       dispatch({ type: reducerCases.END_CALL });
//     });

//     return () => {
//       socketRef.current.off("video-call-rejected");
//       socketRef.current.off("voice-call-rejected");
//     };
//   }, [socketRef, dispatch]);

//   return (
//     <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white">
//       <div className="flex flex-col gap-3 items-center">
//         <span className="text-5xl">{data.name}</span>
//         <span className="text-lg">
//           {callAccepted && data.callType !== "video" ? "On Going Call" : "Calling"}
//         </span>
//       </div>
//       {(!callAccepted || data.callType === "audio") && (
//         <div className="my-24">
//           <Image src={data.profileImage} alt="avatar" width={300} height={300} className="rounded-full" />
//         </div>
//       )}
//       <div className="my-5 relative" id="remote-video">
//         <div className="absolute bottom-5 right-5" id="local-audio"></div>
//       </div>
//       <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full">
//         <MdOutlineCallEnd className="text-3xl cursor-pointer" onClick={endCall} />
//       </div>
//     </div>
//   );
// }

// export default Container;

// import { reducerCases } from "@/context/constants";
// import { useStateValue } from "@/context/StateContext";
// import { GET_CALL_TOKEN } from "@/utils/ApiRoutes";
// import axios from "axios";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import { MdOutlineCallEnd } from "react-icons/md";

// function Container({ data }) {
//   const [{ userInfo, socketRef, videoCall, voiceCall }, dispatch] = useStateValue();
//   const [callAccepted, setCallAccepted] = useState(false);
//   const [token, setToken] = useState(undefined);
//   const [zgVar, setZgVar] = useState(undefined);
//   const [localStream, setLocalStream] = useState(undefined);
//   const [publishStream, setPublishStream] = useState(undefined);

//   const APP_ID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID, 10);
//   const SERVER_ID = process.env.NEXT_PUBLIC_ZEGO_SERVER_ID;

//   useEffect(() => {
//     if (data.type === "out-going") {
//       socketRef.current.on("accept-call", () => setCallAccepted(true));
//     } else {
//       setTimeout(() => {
//         setCallAccepted(true);
//       }, 1000);
//     }
//   }, [data, socketRef]);

//   useEffect(() => {
//     const getToken = async () => {
//       try {
//         const { data: { token: rtoken } } = await axios.get(`${GET_CALL_TOKEN}/${userInfo.id}`);
//         setToken(rtoken);
//       } catch (error) {
//         console.error("Error getting call token:", error);
//       }
//     };

//     if (callAccepted) {
//       getToken();
//     }
//   }, [callAccepted, userInfo.id]);

//   useEffect(() => {
//     const startCall = async () => {
//       try {
//         const { ZegoExpressEngine } = await import("zego-express-engine-webrtc");
//         const zg = new ZegoExpressEngine(APP_ID, SERVER_ID);
//         setZgVar(zg);

//         zg.on("roomStreamUpdate", async (roomID, updateType, streamList) => {
//           if (updateType === "ADD") {
//             console.log("Stream added:", streamList);
//             const rmVideo = document.getElementById("remote-video");
//             const videoElement = document.createElement(data.callType === "video" ? "video" : "audio");
//             videoElement.id = streamList[0].streamID;
//             videoElement.autoplay = true;
//             videoElement.playsInline = true;
//             videoElement.muted = false;
//             videoElement.width="200px"
//             if (rmVideo) {
//               rmVideo.appendChild(videoElement);
//             }
//             try {
//               const stream = await zg.startPlayingStream(streamList[0].streamID, {
//                 audio: true,
//                 video: data.callType === "video",
//               });
//               videoElement.srcObject = stream;
//             } catch (error) {
//               console.error("Error starting to play stream:", error);
//             }
//           } else if (updateType === "DELETE" && zg && localStream && streamList[0].streamID) {
//             zg.stopPublishingStream(streamList[0].streamID);
//             zg.destroyStream(localStream);
//             zg.logoutRoom(data.roomId.toString());
//             dispatch({ type: reducerCases.END_CALL });
//           }
//         });

//         await zg.loginRoom(data.roomId.toString(), token, {
//           userID: userInfo.id.toString(),
//           userName: userInfo.name,
//         }, { userUpdate: true });

//         const localStream = await zg.createStream({
//           camera: {
//             audio: true,
//             video: data.callType === "video",
//           },
//         });

//         console.log("Local stream created:", localStream);
//         const localVideo = document.getElementById("local-audio");
//         const videoElement = document.createElement(data.callType === "video" ? "video" : "audio");
//         videoElement.id = "video-local-zego";
//         videoElement.className = "h-28 w-32";
//         videoElement.autoplay = true;
//         videoElement.muted = true;
//         videoElement.playsInline = true;
//         videoElement.width="200px"

//         localVideo.appendChild(videoElement);
//         videoElement.srcObject = localStream;

//         const streamID = "123" + Date.now();
//         setPublishStream(streamID);
//         setLocalStream(localStream);
//         await zg.startPublishingStream(streamID, localStream);
//       } catch (error) {
//         console.error("Error initializing Zego Express Engine:", error);
//       }
//     };

//     if (token) {
//       startCall();
//     }
//   }, [token, data.callType, data.roomId, dispatch, userInfo.id, userInfo.name]);

//   const endCall = () => {
//     const id = data.id;
//     if (zgVar && localStream && publishStream) {
//       zgVar.stopPublishingStream(publishStream);
//       zgVar.destroyStream(localStream);
//       zgVar.logoutRoom(data.roomId.toString());
//     }
//     if (data.callType === "voice") {
//       socketRef.current.emit("reject-voice-call", { from: id });
//     } else {
//       socketRef.current.emit("reject-video-call", { from: id });
//     }
//     dispatch({ type: reducerCases.END_CALL });
//   };

//   useEffect(() => {
//     socketRef.current.on("video-call-rejected", () => {
//       dispatch({ type: reducerCases.END_CALL });
//     });
//     socketRef.current.on("voice-call-rejected", () => {
//       dispatch({ type: reducerCases.END_CALL });
//     });

//     return () => {
//       socketRef.current.off("video-call-rejected");
//       socketRef.current.off("voice-call-rejected");
//     };
//   }, [socketRef, dispatch]);

//   return (
//     <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white">
//       <div className="flex flex-col gap-3 items-center">
//         <span className="text-5xl">{data.name}</span>
//         <span className="text-lg">
//           {callAccepted && data.callType !== "video" ? "On Going Call" : "Calling"}
//         </span>
//       </div>
//       {(!callAccepted || data.callType === "audio") && (
//         <div className="my-24">
//           <Image src={data.profileImage} alt="avatar" width={300} height={300} className="rounded-full" />
//         </div>
//       )}
//       <div className="my-5 relative" id="remote-video"></div>
//       <div className="my-5 relative" id="local-audio"></div>
//       <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full">
//         <MdOutlineCallEnd className="text-3xl cursor-pointer" onClick={endCall} />
//       </div>
//     </div>
//   );
// }

// export default Container;
