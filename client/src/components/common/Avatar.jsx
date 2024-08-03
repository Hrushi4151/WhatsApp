import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FcRotateCamera } from "react-icons/fc";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";

function Avatar({ type, image, setImage }) {
  const [hover, sethover] = useState(false);
  const [grabPhoto, setgrabPhoto] = useState(false);
  const [showphotolibrary, setshowphotolibrary] = useState(false);
  const [showCapturedPhoto, setshowCapturedPhoto] = useState(false);


  const [isContextMenuVisible, setisContextMenuVisible] = useState(false);
  
  useEffect(() => {
    if(grabPhoto){
      const data=document.getElementById('photo-picker')
      data.click()
      document.body.onfocus=(e)=>{
        setTimeout(() => {
          setgrabPhoto(false)
        }, 1000);
      }
    }
  }, [grabPhoto])
  


  const contextMenuOptions = [
    { name: "Take Photo", callback: () => {
      setshowCapturedPhoto(true);
    } },
    { name: "Choose From Library", callback: () => {setshowphotolibrary(true)} },
    { name: "Upload Photo", callback: () => {
      setgrabPhoto(true);
    } },
    { name: "Remove Photo", callback: () => {
      setImage("/default_avatar.png");
    } },
  ];

  const photopickerchange =async (e)=>{
    
     const file=e.target.files[0];
     const reader=new FileReader();
     const data=document.createElement('img');
      reader.onload=(event)=>{
        data.src=event.target.result;
        data.setAttribute('data-src',event.target.result);
      }
      reader.readAsDataURL(file);
      setTimeout(() => {
        setImage(data.src);
      }, 100);
     
  }



  const [contextMenuCoor, setcontextMenuCoor] = useState({
    x: 0,
    y: 0,
  });

  const showContextMenu = (e) => {
    e.preventDefault();
    setisContextMenuVisible(true);
    setcontextMenuCoor({ x: e.pageX, y: e.pageY });
  };

  return (
    <>
      <div className="flex items-center justify-center">
        {type === "sm" && (
          <div className="relative h-10 w-10">
            <Image src={image} alt="avatar" className="rounded-full" fill />
          </div>
        )}
        {type === "lg" && (
          <div className="relative h-14 w-14">
            <Image src={image} alt="avatar" className="rounded-full" fill />
          </div>
        )}
        {type === "xl" && (
          <div
            className="relative cursor-pointer z-0"
            onMouseEnter={() => sethover(true)}
            onMouseLeave={() => sethover(false)}
          >
            <div
              className={`z-10 bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2
            ${hover ? "visible" : "hidden"}
            `}
              onClick={(e) => showContextMenu(e)}
              id="context-opener"
            >
              <FcRotateCamera
              id="context-opener"
                className="text-5xl"
                onClick={(e) => showContextMenu(e)}
              />
              <span id="context-opener" onClick={(e) => showContextMenu(e)}>
                Change Profile Photo
              </span>
            </div>
            <div
              className="flex justify-center items-center h-60 w-60"
              onClick={(e) => showContextMenu(e)}
            >
              <Image src={image} alt="avatar" className="rounded-full" fill />
            </div>
          </div>
        )}
      </div>
      {isContextMenuVisible && (
        <ContextMenu
          options={contextMenuOptions}
          coordinates={contextMenuCoor}
          contextMenu={isContextMenuVisible}
          setContextMenu={setisContextMenuVisible}
        />
      )}
      {showCapturedPhoto && <CapturePhoto setImage={setImage} hide={setshowCapturedPhoto} />}
      {grabPhoto && <PhotoPicker onChange={photopickerchange} />}
      {showphotolibrary && <PhotoLibrary setImage={setImage} hidePhotoLibrary={setshowphotolibrary} />}
    </>
  );
}

export default Avatar;
