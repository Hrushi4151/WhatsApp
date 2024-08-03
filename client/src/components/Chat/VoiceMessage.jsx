// import { useStateValue } from "@/context/StateContext";
// import React, { useEffect, useRef, useState } from "react";
// import WaveSurfer from "wavesurfer.js";
// import Avatar from "../common/Avatar";
// import { FaPause, FaPlay } from "react-icons/fa";
// import { calculateTime } from "@/utils/CalculateTime";
// import MessageStatus from "../common/MessageStatus";
// import { HOST } from "@/utils/ApiRoutes";

// function VoiceMessage({ message }) {
//   const [{ currentChatUser, userInfo }] = useStateValue();
//   const [audioMessage, setaudioMessage] = useState(null);
//   const [IsPlaying, setIsPlaying] = useState(false);
//   const [currentPlaybackTime, setcurrentPlaybackTime] = useState(0);
//   const [totalDuration, settotalDuration] = useState(0);

//   const waveFormRef = useRef(null);
//   const waveForm = useRef(null);

//   const formatTime = (time) => {
//     if (isNaN(time)) return "00:00";
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes.toString().padStart(2, "0")}:${seconds
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   useEffect(() => {
//     const audiourl = `${HOST}/${message.message}`;
//     const audio = new Audio(audiourl);
//     setaudioMessage(audio);
//     waveForm.current?.load(audiourl);
//     waveForm.current?.on("ready", () => {
//       settotalDuration(waveForm.current.getDuration());
//     });
//   }, [message.message]);

//   useEffect(() => {
//     if (audioMessage) {
//       const updatePlayBackTime = () => {
//         setcurrentPlaybackTime(audioMessage.currentTime);
//       };
//       audioMessage.addEventListener("timeupdate", updatePlayBackTime);

//       return () => {
//         audioMessage.removeEventListener("timeupdate", updatePlayBackTime);
//       };
//     }
//   }, [audioMessage]);

//   useEffect(() => {
//     if (waveForm.current === null) {
//       waveForm.current = WaveSurfer.create({
//         container: waveFormRef.current,
//         waveColor: "#ccc",
//         progressColor: "#4a9eff",
//         cursorColor: "#7ae3c3",
//         barWidth: 2,
//         height: 30,
//         responsive: true,
//       });

//       waveForm.current.on("finish", () => {
//         setIsPlaying(false);
//       });
//     }

//     return () => {
//       waveForm.current.destroy();
//     };
//   }, []);

//   const handlePlayAudio = () => {
//     if (audioMessage) {
//       waveForm.current.stop();
//       waveForm.current.play();
//       audioMessage.play();
//       setIsPlaying(true);
//     }
//   };

//   const handlePauseAudio = () => {
//     waveForm.current.stop();
//     audioMessage.pause();
//     setIsPlaying(false);
//   };
//   return (
//     <div
//       className={`flex items-center gap-5 text-white pr-2 py-4 text-sm rounded-md  ${
//         message.senderId === currentChatUser.id
//       } ? "bg-incoming-backgrround":" bg-outgoing-background"`}
//     >

//       <div>
//         <Avatar type={'lg'} image={currentChatUser?.profileImage} />
//       </div>
//       <div className=" cursor-pointer text-xl ">
//         {!IsPlaying ?
//       <FaPlay onClick={handlePlayAudio} />:<FaPause onClick={handlePauseAudio}/>  
//       }

//       </div>
//       <div className=" relative ">
//      <div className="w-60" ref={waveFormRef}>
//      <div className="text-bubble-meta text-[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full">
//       <span>
//         {formatTime(IsPlaying ? currentPlaybackTime:totalDuration)}
//       </span>
//       <div className="flex gap-1">
//   <span>
//     {calculateTime(message.createdAt)}

//   </span>
//   {
//     message.senderId===userInfo.id && <MessageStatus messageStatus={message.messageStatus}  />
//   }
//       </div>
//      </div>
//      </div>
//       </div>
//     </div>
//   );
// }

// export default VoiceMessage;


// import { useStateValue } from "@/context/StateContext";
// import React, { useEffect, useRef, useState } from "react";
// import WaveSurfer from "wavesurfer.js";
// import Avatar from "../common/Avatar";
// import { FaPause, FaPlay } from "react-icons/fa";
// import { calculateTime } from "@/utils/CalculateTime";
// import MessageStatus from "../common/MessageStatus";
// import { HOST } from "@/utils/ApiRoutes";

// function VoiceMessage({ message }) {
//   const [{ currentChatUser, userInfo }] = useStateValue();
//   const [audioMessage, setAudioMessage] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
//   const [totalDuration, setTotalDuration] = useState(0);

//   const waveFormRef = useRef(null);
//   const waveForm = useRef(null);

//   const formatTime = (time) => {
//     if (isNaN(time)) return "00:00";
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes.toString().padStart(2, "0")}:${seconds
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   useEffect(() => {
//     const audioUrl = `${HOST}/${message.message}.mp3`;
//     const audio = new Audio(audioUrl);
//     setAudioMessage(audio);
//     if (waveForm.current) {
//       waveForm.current.load(audioUrl);
//       waveForm.current.on("ready", () => {
//         setTotalDuration(waveForm.current.getDuration());
//       });
//     }
//   }, [message.message]);

//   useEffect(() => {
//     if (audioMessage) {
//       const updatePlaybackTime = () => {
//         setCurrentPlaybackTime(audioMessage.currentTime);
//       };
//       audioMessage.addEventListener("timeupdate", updatePlaybackTime);

//       return () => {
//         audioMessage.removeEventListener("timeupdate", updatePlaybackTime);
//       };
//     }
//   }, [audioMessage]);

//   useEffect(() => {
//     if (waveForm.current === null) {
//       waveForm.current = WaveSurfer.create({
//         container: waveFormRef.current,
//         waveColor: "#ccc",
//         progressColor: "#4a9eff",
//         cursorColor: "#7ae3c3",
//         barWidth: 2,
//         height: 30,
//         responsive: true,
//       });

//       waveForm.current.on("finish", () => {
//         setIsPlaying(false);
//       });
//     }
//   }, []);

//   const handlePlayAudio = () => {
//     if (audioMessage) {
//       waveForm.current.play();
//       audioMessage.play();
//       setIsPlaying(true);
//     }
//   };

//   const handlePauseAudio = () => {
//     if (audioMessage) {
//       waveForm.current.pause();
//       audioMessage.pause();
//       setIsPlaying(false);
//     }
//   };

//   return (
//     <div
//       className={`flex items-center gap-5 text-white pr-2 py-4 text-sm rounded-md ${
//         message.senderId === currentChatUser.id
//           ? "bg-incoming-background"
//           : "bg-outgoing-background"
//       }`}
//     >
//       <div>
//         <Avatar type={'lg'} image={currentChatUser?.profileImage} />
//       </div>
//       <div className="cursor-pointer text-xl">
//         {!isPlaying ? (
//           <FaPlay onClick={handlePlayAudio} />
//         ) : (
//           <FaPause onClick={handlePauseAudio} />
//         )}
//       </div>
//       <div className="relative">
//         <div className="w-60" ref={waveFormRef}></div>
//         <div className="text-bubble-meta text-[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full">
//           <span>{formatTime(isPlaying ? currentPlaybackTime : totalDuration)}</span>
//           <div className="flex gap-1">
//             <span>{calculateTime(message.createdAt)}</span>
//             {message.senderId === userInfo.id && (
//               <MessageStatus messageStatus={message.messageStatus} />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default VoiceMessage;


import { useStateValue } from "@/context/StateContext";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Avatar from "../common/Avatar";
import { FaPause, FaPlay } from "react-icons/fa";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { HOST } from "@/utils/ApiRoutes";

function VoiceMessage({ message }) {
  const [{ currentChatUser, userInfo }] = useStateValue();
  const [audioMessage, setAudioMessage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const waveFormRef = useRef(null);
  const waveForm = useRef(null);

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const audioUrl = `${HOST}/${message.message}.mp3`;
    console.log("Audio URL:", audioUrl);  // Debugging line
    const audio = new Audio(audioUrl);

    // Check if the audio can play
    audio.addEventListener('canplaythrough', () => {
      console.log('Audio can play through.');
      setAudioMessage(audio);
      if (waveForm.current) {
        waveForm.current.load(audioUrl);
        waveForm.current.on("ready", () => {
          console.log("WaveSurfer ready");
          setTotalDuration(waveForm.current.getDuration());
        });
        waveForm.current.on("error", (e) => {
          console.error("WaveSurfer error:", e);
        });
      }
    });

    // Handle error
    audio.addEventListener('error', (e) => {
      console.error('Error loading audio:', e);
    });

  }, [message.message]);

  useEffect(() => {
    if (audioMessage) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(audioMessage.currentTime);
      };
      audioMessage.addEventListener("timeupdate", updatePlaybackTime);

      return () => {
        audioMessage.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [audioMessage]);

  useEffect(() => {
    if (waveForm.current === null) {
      waveForm.current = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: "#ccc",
        progressColor: "#4a9eff",
        cursorColor: "#7ae3c3",
        barWidth: 2,
        height: 30,
        responsive: true,
      });

      waveForm.current.on("finish", () => {
        setIsPlaying(false);
      });

      waveForm.current.on("error", (e) => {
        console.error("WaveSurfer initialization error:", e);
      });
    }

    return () => {
      waveForm.current.destroy();
    };
  }, []);

  const handlePlayAudio = () => {
    if (audioMessage) {
      waveForm.current.play();
      audioMessage.play();
      setIsPlaying(true);
    }
  };

  const handlePauseAudio = () => {
    if (audioMessage) {
      waveForm.current.pause();
      audioMessage.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      className={`flex items-center gap-5 text-white pr-2 py-4 text-sm rounded-md ${
        message.senderId === currentChatUser.id
          ? "bg-incoming-background"
          : "bg-outgoing-background"
      }`}
    >
      <div>
        <Avatar type={'lg'} image={currentChatUser?.profileImage} />
      </div>
      <div className="cursor-pointer text-xl">
        {!isPlaying ? (
          <FaPlay onClick={handlePlayAudio} />
        ) : (
          <FaPause onClick={handlePauseAudio} />
        )}
      </div>
      <div className="relative">
        <div className="w-60" ref={waveFormRef}></div>
        <div className="text-bubble-meta text-[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full">
          <span>{formatTime(isPlaying ? currentPlaybackTime : totalDuration)}</span>
          <div className="flex gap-1">
            <span>{calculateTime(message.createdAt)}</span>
            {message.senderId === userInfo.id && (
              <MessageStatus messageStatus={message.messageStatus} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceMessage;
