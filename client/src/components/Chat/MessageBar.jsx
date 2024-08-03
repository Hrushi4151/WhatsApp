
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa";
import { useStateValue } from "@/context/StateContext";
import axios from "axios";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";
import EmojiPicker from "emoji-picker-react";
import PhotoPicker from "../common/PhotoPicker";
import App from "@/pages/_app";
import VoiceMessage from "./VoiceMessage";
import CaptureAudio from "../common/CaptureAudio";

function MessageBar() {
  const [grabPhoto, setgrabPhoto] = useState(false);
  const [showAudioRecorder, setshowAudioRecorder] = useState(false);
  const [{ userInfo, currentChatUser, socketRef }, dispatch] = useStateValue();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setshowEmojiPicker] = useState(false);
  const emojipickerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id != "emoji-open") {
        if (
          emojipickerRef.current &&
          !emojipickerRef.current.contains(event.target)
        ) {
          setshowEmojiPicker(false);
        }
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setgrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);

  const photopickerchange = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
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

  const handleEmojiModal = () => {
    setshowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.emoji);
  };

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("msg-receive", (newMessage) => {
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: newMessage,
          fromSelf: false,
        });
      });
    }

    // Clean up the listener on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off("msg-receive");
      }
    };
  }, [socketRef, dispatch]);

  const sendMessage = async () => {
    try {
      const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message: message,
      });
      socketRef.current.emit("send-msg", {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message: data.message,
      });
      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: {
          ...data.message,
        },
        fromSelf: true,
      });
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      <>
      {!showAudioRecorder  && <>
      
      
        <div className="flex gap-6">
          <BsEmojiSmile
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Emoji"
            onClick={handleEmojiModal}
            id="emoji-open"
          />
          {showEmojiPicker && (
            <div
              className=" absolute bottom-24 left-16 z-40"
              ref={emojipickerRef}
            >
              <EmojiPicker
                onEmojiClick={(e) => handleEmojiClick(e)}
                theme="dark"
              />
            </div>
          )}
          <ImAttachment
            onClick={() => setgrabPhoto(true)}
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Attach File"
          />
        </div>
        <div className="w-full rounded-lg flex items-center h-10">
          <input
            type="text"
            placeholder="Type a Message"
            className="w-full bg-input-background text-sm focus:outline-none text-white rounded-lg h-10 px-5 py-4"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        </div>
        </>}
        <div className="flex w-10 items-center justify-center">
          {message.length ? (
            <MdSend
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Send Message"
              onClick={sendMessage}
            />
          ) : (
            <FaMicrophone
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Record"
              onClick={()=>setshowAudioRecorder(true)}
            />
          )}
        </div>
      </>
      {grabPhoto && <PhotoPicker onChange={(e) => photopickerchange(e)} />}
      {showAudioRecorder && <CaptureAudio  hide={setshowAudioRecorder}/>}
    </div>
  );
}

export default MessageBar;
