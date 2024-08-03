import { reducerCases } from "@/context/constants";
import { useStateValue } from "@/context/StateContext";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function logout() {
   const router=useRouter();
  const[{userInfo,socketRef},dispatch]=useStateValue();

  useEffect(() => {
    socketRef.current.emit("signout",userInfo.id);
    dispatch({type:reducerCases.SET_USER_INFO,userInfo:undefined})
    signOut(firebaseAuth);
    router.push("/login")
  }, [socketRef])
  
  return <div className="bg-conversation-panel-background">
    
  </div>;
}

export default logout;
