import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { useStateValue } from "@/context/StateContext";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import { reducerCases } from "@/context/constants";
import { useRouter } from "next/navigation";
import ContextMenu from "../common/ContextMenu";
function ChatListHeader() {
  const [{ userInfo, contactsPage }, dispatch] = useStateValue();
  const [isContextMenuVisible, setisContextMenuVisible] = useState(false);
  const router = useRouter();
  const [contextMenuCoor, setcontextMenuCoor] = useState({
    x: 0,
    y: 0,
  });

  const showContextMenu = (e) => {
    e.preventDefault();
    setisContextMenuVisible(true);
    setcontextMenuCoor({ x: e.pageX - 50, y: e.pageY });
  };

  const contextMenuOptions = [
    {
      name: "Logout",
      callback: async () => {
        setisContextMenuVisible(false);
        router.push("/logout");
      },
    },
  ];
  console.log("list")

  const handleAllContactsPage = () => {
    dispatch({
      type: reducerCases.SET_ALL_CONTACTS_PAGE,
    });
  };
  

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center ">
      <div className=" cursor-pointer">
        <Avatar type="sm" image={userInfo?.profileImage} />
      </div>
      <div className="flex gap-6 ">
        <BsFillChatLeftTextFill
          className="text-panel-header-icon cursor-pointer text-xl"
          title="New Chat"
          onClick={() => handleAllContactsPage()}
        />
        <BsThreeDotsVertical
          className="text-panel-header-icon cursor-pointer text-xl"
          title="Menu"
          onClick={(e) => showContextMenu(e)}
          id="context-opener"
        />
        {isContextMenuVisible && (
          <ContextMenu
            options={contextMenuOptions}
            coordinates={contextMenuCoor}
            contextMenu={isContextMenuVisible}
            setContextMenu={setisContextMenuVisible}
          />
        )}
      </div>
    </div>
  );
}

export default ChatListHeader;
