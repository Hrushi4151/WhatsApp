import React, { useEffect, useRef } from "react";

function ContextMenu({ options, coordinates, contextMenu, setContextMenu }) {
  const contextMenuRef = useRef(null);

  useEffect(() => {
    const handleoutsideclick=(e)=>{
         if(e.target.id !="context-opener"){

          setContextMenu(false);
         }
    }
    document.addEventListener("click",handleoutsideclick);
    return ()=>{
      removeEventListener("click",handleoutsideclick)
    }
  }, [])


  

  const handleClick = (e, callback) => {
    e.stopPropagation();
    setContextMenu(false);
    callback();
  };
  return (
    <div
      className={`bg-dropdown-background fixed py-2 z-100  shadow-xl`}
      style={
        {top:coordinates.y,
        left:coordinates.x}
      }
      ref={contextMenuRef}
    >
      <ul>
        {options.map(({name, callback}) => (
          <li key={name} onClick={(e) => handleClick(e, callback)}
          className="px-5 py-2 cursor-pointer hover:bg-background-default-hover"
          >
            <span className="text-white">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContextMenu;
