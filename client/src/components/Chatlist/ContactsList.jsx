// import { reducerCases } from "@/context/constants";
// import { useStateValue } from "@/context/StateContext";
// import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { BiArrowBack } from "react-icons/bi";

// function ContactsList() {

//   const [allcontacts, setallcontacts] = useState([])
//   const [{},dispatch]=useStateValue();

//   useEffect(() => {

//     const getContacts=async()=>{
//       try {
//         const {data:{users}}=await axios.get(GET_ALL_CONTACTS);
//         setallcontacts(users)
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     getContacts()

//   }, [])

//   return <div className="h-full flex flex-col">
//     <div className="h-24 flex- items-end px-3 py-4">
//        <div className="flex items-center gap-12 text-white">
//         <BiArrowBack className=" cursor-pointer text-xl"
//         onClick={()=>dispatch({
//           type:reducerCases.SET_ALL_CONTACTS_PAGE
//         })}
//         />
//        </div>
//     </div>

//   </div>;
// }

// export default ContactsList;

import { reducerCases } from "@/context/constants";
import { useStateValue } from "@/context/StateContext";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { BiSearchAlt2 } from "react-icons/bi";
import ChatLIstItem from "./ChatLIstItem";

function ContactsList() {
  const [allcontacts, setallcontacts] = useState([]);
  const [{ contactsPage }, dispatch] = useStateValue();
  const [searchTerm, setsearchTerm] = useState("");
  const [searchContacts, setsearchContacts] = useState([]);

  useEffect(() => {
    if (searchTerm.length) {
      const filteredData = {};
      Object.keys(allcontacts).forEach((key) => {
        filteredData[key] = allcontacts[key].filter((obj) =>
          obj.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setsearchContacts(filteredData);
    } else {
      setsearchContacts(allcontacts);
    }
  }, [searchTerm]);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: { users },
        } = await axios.get(GET_ALL_CONTACTS);
        setallcontacts(users);
        setsearchContacts(users);
      } catch (error) {
        console.log(error);
      }
    };
    getContacts();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="h-24 flex items-end px-3 py-4">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack
            className="cursor-pointer text-xl"
            onClick={() =>
              dispatch({
                type: reducerCases.SET_ALL_CONTACTS_PAGE,
              })
            }
          />
          <span>New Chat</span>
        </div>
      </div>
      <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
        <div className="flex py-3 gap-3 h-14 items-center">
          <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
            <div>
              <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
            </div>
            <div>
              <input
                value={searchTerm}
                onChange={(e) => setsearchTerm(e.target.value)}
                type="text"
                placeholder="Search Contacts"
                className="bg-transparent text-sm focus:outline-none text-white w-full"
              />
            </div>
          </div>
        </div>
        {Object.entries(searchContacts).map(([initialLetter, userList]) => {
          return (
            <>
              {!searchTerm && (
                <div
                  key={initialLetter + 1}
                  className="text-teal-light pl-10 py-5"
                >
                  {initialLetter}
                </div>
              )}{" "}
              {userList.map((contact) => {
                return (
                  <ChatLIstItem
                    data={contact}
                    isContachPage={true}
                    key={contact}
                  />
                );
              })}
            </>
          );
        })}
      </div>
    </div>
  );
}

export default ContactsList;
