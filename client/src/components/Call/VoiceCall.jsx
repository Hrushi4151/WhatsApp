import React, { useEffect } from "react";
import Container from "./Container";
import { useStateValue } from "@/context/StateContext";

function VoiceCall() {
  const [{voiceCall,socketRef,userInfo}]=useStateValue();

  useEffect(() => {
    if(voiceCall.type=="out-going"){
      
      socketRef.current.emit("outgoing-voice-call",{
        to:voiceCall.id,
        from:{
          id:userInfo.id,
          profileImage:userInfo.profileImage,
          name:userInfo.name,
        },
        callType:voiceCall.callType,
        roomId:voiceCall.roomId,
      })
    }
  }, [])
  

  return <div>
   <Container data={voiceCall} />
  </div>;
}

export default VoiceCall;
