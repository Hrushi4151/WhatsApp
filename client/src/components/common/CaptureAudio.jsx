// import { useStateValue } from "@/context/StateContext";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   FaMicrophone,
//   FaPauseCircle,
//   FaPlay,
//   FaStop,
//   FaTrash,
// } from "react-icons/fa";
// import { MdSend } from "react-icons/md";
// import WaveSurfer from "wavesurfer.js";

// function CaptureAudio({ hide }) {
//   const [{ userInfo, currentChatUser, socketRef }, dispatch] = useStateValue();
//   const [isRecording, setisRecording] = useState(false);
//   const [recordedAudio, setrecordedAudio] = useState(null);
//   const [waveForm, setwaveForm] = useState(null);
//   const [recordingDuration, setrecordingDuration] = useState(0);
//   const [currentPlaybackTime, setcurrentPlaybackTime] = useState(0);
//   const [totalDuration, settotalDuration] = useState(0);
//   const [isPlaying, setisPlaying] = useState(0);
//   const [renderedAudio, setrenderedAudio] = useState(null);

//   const audioRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const waveFormRef = useRef(null);

//   useEffect(() => {
//     let interval;
//     if (isRecording) {
//       interval = setInterval(() => {
//         setrecordingDuration((prevDuration) => {
//           settotalDuration(prevDuration + 1);
//           return prevDuration + 1;
//         });
//       }, 1000);
//     }

//     return () => {
//       clearInterval(interval);
//     };
//   }, [isRecording]);



//   useEffect(() => {
//     const wavesurfer = WaveSurfer.create({
//       container: waveFormRef.current,
//       waveColor: "#ccc",
//       progressColor: "#4a9eff",
//       cursorColor: "#7ae3c3",
//       barWidth: 2,
//       height: 30,
//       responsive: true,
//     });
//     setwaveForm(wavesurfer);

//     wavesurfer.on("finish", () => {
//       setisPlaying(false);
//     });

//     return () => {
//       wavesurfer.destroy();
//     };
//   }, []);

//   useEffect(() => {
//     if (waveForm) {
//       handleStartRecording();
//     }
//   }, [waveForm]);

//   const handleStartRecording = () => {
//     setrecordingDuration(0);
//     setcurrentPlaybackTime(0);
//     settotalDuration(0);
//     setisRecording(true);

//     navigator.mediaDevices
//       .getUserMedia({ audio: true })
//       .then((stream) => {
//         const mediaRecorder = new MediaRecorder(stream);
//         mediaRecorderRef.current = mediaRecorder;
//         audioRef.current.srcObject = stream;

//         const chunks = [];
//         mediaRecorder.ondataavailable = (event) => chunks.push(event.data);
//         mediaRecorder.onstop = () => {
//           const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
//           const audiourl = URL.createObjectURL(blob);
//           const audio = new Audio(audiourl);
//           setrecordedAudio(audio);

//           waveForm.load(audiourl);
//         };
//       })
//       .catch((error) => {
//         console.log("Microphone error", error);
//       });
//   };

  


//   const handleStopRecording = () => {

//     if(mediaRecorderRef.current && isRecording){
//       mediaRecorderRef.current.stop();
//       setisRecording(false);
//       waveForm.stop();
    

//     const audioChunks=[];
//     mediaRecorderRef.current.addEventListener("dataavailable",(e)=>{
//         audioChunks.puch(e.data)
//     })


//     mediaRecorderRef.current.addEventListener("stop",()=>{
//       const audioBlob=new Blob(audioChunks,{type:"audio/mp3"});
//       const audioFile=new File([audioBlob], "recording.mp3")
//       setrenderedAudio(audioFile);
//     })
//   }
//   };


//   useEffect(() => {
//     if(recordedAudio){
//       const updatePlayBackTime=()=>{
//         setcurrentPlaybackTime(recordedAudio.currentTime);
//       }
//       recordedAudio.addEventListener("timeupdate",updatePlayBackTime)

//       return ()=>{
//         recordedAudio.removeEventListener("timeupdate",updatePlayBackTime)
//       }
//     }
//   }, [recordedAudio])
  

//   const handlePlayRecording = () => {
//     if(recordedAudio){
//       waveForm.stop();
//       waveForm.play();
//       recordedAudio.play();
//       setisPlaying(true);
//     }

//   };

//   const handlePauseRecording = () => {
//     waveForm.stop();
//     recordedAudio.pause();
//     setisPlaying(false);

//   };

//   const sendRecording = async () => {};

//   const formatTime = (time) => {
//     if (isNaN(time)) return "00:00";
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes.toString().padStart(2, "0")}:${seconds
//       .toString()
//       .padStart(2, "0")}`;
//   };


//   return (
//     <div className="flex text-2xl w-full justify-end items-center ">
//       <div className="pt-1">
//         <FaTrash
//           className="text-panel-header-icon"
//           onClick={() => hide(false)}
//         />
//       </div>
//       <div className="mx-4 py-4 px-2 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-3xl">
//         {isRecording ? (
//           <div className="text-red-500 w-60 text-center animate-pulse">
//             Recording:
//             <span>{recordingDuration}</span>
//           </div>
//         ) : (
//           <div>
//             {recordedAudio && (
//               <>
//                 {!isPlaying ? (
//                   <FaPlay onClick={handlePlayRecording} />
//                 ) : (
//                   <FaStop onClick={handlePauseRecording} />
//                 )}
//               </>
//             )}
//           </div>
//         )}
//         <div className="w-60" ref={waveFormRef} hidden={isRecording} />
//         {recordedAudio && isPlaying && (
//           <span>{formatTime(currentPlaybackTime)}</span>
//         )}
//         {recordedAudio && !isPlaying && (
//           <span>{formatTime(totalDuration)}</span>
//         )}
//         <audio ref={audioRef} hidden />
//         </div>
//         <div className="mr-4">
//           {!isRecording ? (
//             <FaMicrophone
//               className="text-red-500"
//               onClick={handleStartRecording}
//             />
//           ) : (
//             <FaPauseCircle
//               className="text-red-500"
//               onClick={handleStopRecording}
//             />
//           )}
//         </div>

//         <div>
//           <MdSend
//             className="text-panel-header-icon cursor-pointer mr-4"
//             title="Send"
//             onClick={sendRecording}
//           />
//         </div>
     
//     </div>
//   );
// }

// export default CaptureAudio;




import { reducerCases } from "@/context/constants";
import { useStateValue } from "@/context/StateContext";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaPauseCircle,
  FaPlay,
  FaStop,
  FaTrash,
} from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";

function CaptureAudio({ hide }) {
  const [{ userInfo, currentChatUser, socketRef }, dispatch] = useStateValue();
  const [isRecording, setisRecording] = useState(false);
  const [recordedAudio, setrecordedAudio] = useState(null);
  const [waveForm, setwaveForm] = useState(null);
  const [recordingDuration, setrecordingDuration] = useState(0);
  const [currentPlaybackTime, setcurrentPlaybackTime] = useState(0);
  const [totalDuration, settotalDuration] = useState(0);
  const [isPlaying, setisPlaying] = useState(false);
  const [renderedAudio, setrenderedAudio] = useState(null);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveFormRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setrecordingDuration((prevDuration) => prevDuration + 1);
        settotalDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
    });
    setwaveForm(wavesurfer);

    wavesurfer.on("finish", () => {
      setisPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, []);

  const handleStartRecording = () => {
    setrecordingDuration(0);
    setcurrentPlaybackTime(0);
    settotalDuration(0);
    setisRecording(true);
    setrecordedAudio(null)

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioRef.current.srcObject = stream;

        const chunks = [];
        mediaRecorder.ondataavailable = (event) => chunks.push(event.data);

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          const audiourl = URL.createObjectURL(blob);
          const audio = new Audio(audiourl);
          setrecordedAudio(audio);
          setrenderedAudio(blob);

          waveForm.load(audiourl);
        };

        mediaRecorder.start();
      })
      .catch((error) => {
        console.log("Microphone error", error);
      });
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setisRecording(false);
      waveForm.stop();
    }
  };

  useEffect(() => {
    if (recordedAudio) {
      const updatePlayBackTime = () => {
        setcurrentPlaybackTime(recordedAudio.currentTime);
      };
      recordedAudio.addEventListener("timeupdate", updatePlayBackTime);

      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlayBackTime);
      };
    }
  }, [recordedAudio]);

  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveForm.stop();
      waveForm.play();
      recordedAudio.play();
      setisPlaying(true);
    }
  };

  const handlePauseRecording = () => {
    waveForm.stop();
    recordedAudio.pause();
    setisPlaying(false);
  };

  const sendRecording = async () => {
    try {
      const formData = new FormData();
      formData.append("audio", renderedAudio);
      const res = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: userInfo.id,
          to: currentChatUser.id,
        },
      });
      if (res.status == "201") {

    
        socketRef.current.emit("send-msg", {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message: res.data.message,
        });
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...res.data.message,
          },
          fromSelf: true,
        });

        
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex text-2xl w-full justify-end items-center ">
      <div className="pt-1">
        <FaTrash
          className="text-panel-header-icon"
          onClick={() => hide(false)}
        />
      </div>
      <div className="mx-4 py-4 px-2 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-3xl">
        {isRecording ? (
          <div className="text-red-500 w-60 text-center animate-pulse">
            Recording:
            <span>{recordingDuration}</span>
          </div>
        ) : (
          <div>
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay onClick={handlePlayRecording} />
                ) : (
                  <FaStop onClick={handlePauseRecording} />
                )}
              </>
            )}
          </div>
        )}
        <div className="w-60" ref={waveFormRef} hidden={isRecording} />
        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlaybackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
        <audio ref={audioRef} hidden />
      </div>
      <div className="mr-4">
        {!isRecording ? (
          <FaMicrophone
            className="text-red-500"
            onClick={()=>handleStartRecording()}
          />
        ) : (
          <FaPauseCircle
            className="text-red-500"
            onClick={handleStopRecording}
          />
        )}
      </div>
      <div>
        <MdSend
          className="text-panel-header-icon cursor-pointer mr-4"
          title="Send"
          onClick={sendRecording}
        />
      </div>
    </div>
  );
}

export default CaptureAudio;

