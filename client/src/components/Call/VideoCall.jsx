import React, { useEffect } from "react";
import Container from "./Container";
import { useStateValue } from "@/context/StateContext";

function VideoCall() {
  const [{videoCall,socketRef,userInfo}]=useStateValue();


  useEffect(() => {
    if(videoCall.type=="out-going"){
      socketRef.current.emit("outgoing-video-call",{
        to:videoCall.id,
        from:{
          id:userInfo.id,
          profileImage:userInfo.profileImage,
          name:userInfo.name,
        },
        callType:videoCall.callType,
        roomId:videoCall.roomId,
      })
    }
  }, [])
  
  return <div>
   <Container data={videoCall} />
  </div>;
}

export default VideoCall;
