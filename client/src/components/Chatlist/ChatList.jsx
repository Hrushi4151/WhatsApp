import React, { useEffect, useState } from "react";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import List from "./List";
import { useStateValue } from "@/context/StateContext";
import ContactsList from "./ContactsList";

function ChatList() {
  const [{ contactsPage }] = useStateValue();
  const [pageType, setpageType] = useState("default");

  useEffect(() => {
    if (contactsPage) {
      setpageType("all-contacts");
    } else {
      setpageType("default");
    }
  }, [contactsPage]);

  return (
    <div className="bg-panel-header-background flex flex-col max-h-screen z-20">
      {pageType =="default" &&
      <>
        <ChatListHeader />
        <SearchBar />
        <List />
      </>
      }
      {pageType =="all-contacts" &&
      <>
        <ContactsList />
      </>
      }
    </div>
  );
}

export default ChatList;
