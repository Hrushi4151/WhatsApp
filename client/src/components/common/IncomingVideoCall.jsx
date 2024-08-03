// import { reducerCases } from "@/context/constants";
// import { useStateValue } from "@/context/StateContext";
// import Image from "next/image";
// import React from "react";

// function IncomingVideoCall() {
//   const [{ incomingVideoCall ,socketRef}, dispatch] = useStateValue();

//   const acceptCall = () => {
//     dispatch({
//       type:reducerCases.SET_VIDEO_CALL,
//       videoCall:{...incomingVideoCall,type:"in-coming"},
//     })

//     socketRef.current.emit("accept-incoming-call",{id:incomingVideoCall.id})
//     dispatch({
//       type:reducerCases.SET_INCOMING_VIDEO_CALL,
//       incomingVideoCall:undefined,
//     })
//   };
//   const rejectCall = () => {
//     socketRef.current.emit("reject-video-call",{
//       from:incomingVideoCall.id
//     })
//     dispatch({
//       type:reducerCases.END_CALL
//     })
//   };

//   return (
//     <div className="h-24 w-80 fixed bottom-8 mb-0 right-6 z-50 rounded-sm flex gap-5 items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14">
//       <div>
//         <Image
//           src={incomingVideoCall.profileImage}
//           alt="avatar"
//           width={100}
//           height={100}
//           className="rounded-full"
//         />
//       </div>
//       <div>{incomingVideoCall.name}
//       <div className="text-xs">Incoming Video Call</div>
//       <div className="flex gap-2 mt-2">
//         <button className="bg-red-500 p-1 px-3 text-sm rounded-full"
//         onClick={rejectCall}
//         >Reject</button>
//         <button className="bg-green-500 p-1 px-3 text-sm rounded-full"
//         onClick={acceptCall}
//         >Accept</button>
//       </div>
//       </div>
//     </div>
//   );
// }

// export default IncomingVideoCall;



import { reducerCases } from "@/context/constants";
import { useStateValue } from "@/context/StateContext";
import Image from "next/image";
import React, { useEffect } from "react";

function IncomingVideoCall() {
  const [{ incomingVideoCall, videoCall, voiceCall, socketRef }, dispatch] = useStateValue();

  const acceptCall = () => {
    dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      videoCall: { ...incomingVideoCall, type: "in-coming" },
    });

    socketRef.current.emit("accept-incoming-call", { id: incomingVideoCall.id });
    dispatch({
      type: reducerCases.SET_INCOMING_VIDEO_CALL,
      incomingVideoCall: undefined,
    });
  };

  const rejectCall = () => {
    socketRef.current.emit("reject-video-call", { from: incomingVideoCall.id });
    dispatch({ type: reducerCases.END_CALL });
  };

  useEffect(() => {
    socketRef.current.on("video-call-rejected", (data) => {
      dispatch({ type: reducerCases.END_CALL });
    });

    return () => {
      socketRef.current.off("video-call-rejected");
    };
  }, []);

  useEffect(() => {
    console.log("Call state changed:", { videoCall, voiceCall });
    if (!videoCall && !voiceCall) {
      // handle call end UI updates here
    }
  }, [videoCall, voiceCall]);

  if (!incomingVideoCall) {
    return null; // Render nothing if there's no incoming call
  }

  return (
    <div className="h-24 w-80 fixed bottom-8 mb-0 right-6 z-50 rounded-sm flex gap-5 items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14">
      <div>
        <Image
          src={incomingVideoCall.profileImage}
          alt="avatar"
          width={100}
          height={100}
          className="rounded-full"
        />
      </div>
      <div>
        {incomingVideoCall.name}
        <div className="text-xs">Incoming Video Call</div>
        <div className="flex gap-2 mt-2">
          <button className="bg-red-500 p-1 px-3 text-sm rounded-full" onClick={rejectCall}>
            Reject
          </button>
          <button className="bg-green-500 p-1 px-3 text-sm rounded-full" onClick={acceptCall}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomingVideoCall;
