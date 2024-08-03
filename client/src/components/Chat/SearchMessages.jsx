import { reducerCases } from "@/context/constants";
import { useStateValue } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

function SearchMessages() {
  const [{ currentChatUser, messages }, dispatch] = useStateValue();
  const [searchTerm, setsearchTerm] = useState("");
  const [searchedMessages, setsearchedMessages] = useState([]);

  useEffect(() => {
    if(searchTerm){

      const filteredMessages = messages.filter((message) => {
        return message.type==="text" && message.message.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setsearchedMessages(filteredMessages);
      console.log(searchedMessages)
    }else{
      setsearchedMessages([])
    }
  }, [searchTerm]);

  

  return (
    <div className="border-conversation-border border-1 w-full bg-con flex flex-col max-h-screen z-10 bg-conversation-panel-background">
      <div className="h-16 px-4 py-5 flex items-center bg-panel-header-background text-primary-strong">
        <IoClose
          className=" cursor-pointer text-icon-lighter text-2xl"
          onClick={() => {
            dispatch({
              type: reducerCases.SET_MESSAGE_SEARCH,
            });
          }}
        />
        <span>Search Messages</span>
      </div>
      <div className="overflow-auto custom-scrollbar h-full">
        <div className="flex items-center flex-col w-full ">
          <div className="flex px-5 items-center gap-3 h-14 w-full ">
            <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
              <div>
                <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
              </div>
              <div>
                <input
                  value={searchTerm}
                  onChange={(e) => setsearchTerm(e.target.value)}
                  type="Search "
                  placeholder="Search Messages"
                  className="bg-transparent text-sm focus:outline-none text-white w-full"
                />
              </div>
            </div>
          </div>
          <span className="mt-10 text-secondary">
            {!searchTerm.length &&
              `Search for Messages With ${currentChatUser?.name}`}
          </span>
        </div>
        <div className="flex justify-center h-fit flex-col">
          {searchTerm.length > 0 && !searchedMessages.length && (
            <span className="text-secondary w-full flex justify-center">
              No Messages Found
            </span>
          )}
        </div>
          {searchedMessages.map((message) => (
        <div className="flex flex-col  w-full h-fit">
            <div className=" cursor-pointer flex flex-col justify-center hover:bg-background-default-hover w-full px-5 border-b-[0.1px] border-secondary py-5">
              <div className="text-sm text-secondary">
                {calculateTime(message.createdAt)}
                {console.log(message.message)}
              </div>
              <div className="text-icon-green">{message.message}</div>
            </div>;
        </div>
          ))}
      </div>
    </div>
  );
}

export default SearchMessages;
