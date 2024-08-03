import { reducerCases } from "@/context/constants";
import { useStateValue } from "@/context/StateContext";
import { GET_INITAIL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect } from "react";
import ChatLIstItem from "./ChatLIstItem";

function List() {

  const [{userInfo,userContacts,filteredContacts},dispatch]=useStateValue();

  useEffect(() => {
    const getContacts=async()=>{
      try {
         
        const {data:{user,onlineUsers}}=await axios.get(`${GET_INITAIL_CONTACTS_ROUTE}/${userInfo?.id}`);
        dispatch({
          type:reducerCases.SET_ONLINE_USERS,
          onlineUsers
        })
        dispatch({
          type:reducerCases.SET_USERS_CONTACTS,
          userContacts:user
        })
      } catch (error) {
        console.log(error)
      }
    }
    if(userInfo?.id){
      getContacts();
    } 
  }, [userInfo,dispatch])

  return <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
    {
      filteredContacts && filteredContacts.length >0 ? (
        filteredContacts?.map((contact)=>(
          <ChatLIstItem  data={contact} key={contact.id} />
          
        ))
      ):
      (userContacts?.map((contact)=>(
        <ChatLIstItem  data={contact} key={contact.id} />
        
      )))
     }
  </div>;
}

export default List;



// import { reducerCases } from "@/context/constants";
// import { useStateValue } from "@/context/StateContext";
// import { GET_INITAIL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
// import axios from "axios";
// import React, { useEffect } from "react";
// import ChatLIstItem from "./ChatLIstItem";

// function List() {
//   const [{userInfo,userContacts},dispatch]=useStateValue();
  
//   useEffect(() => {
//     const getContacts = async () => {
//       try {
//         const { data: { users, onlineUsers } } = await axios.get(`${GET_INITAIL_CONTACTS_ROUTE}/${userInfo?.id}`);
//         dispatch({
//           type: reducerCases.SET_ONLINE_USERS,
//           onlineUsers
//         });
//         dispatch({
//           type: reducerCases.SET_USERS_CONTACTS,
//           userContacts: users
//         });
//       } catch (error) {
//         console.log(error);
//       }
//     };
    
//     getContacts();
    
//   }, [userInfo]);

//   return (
//     <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
//       {userContacts?.map((contact) => (
//         <ChatLIstItem data={contact} key={contact.id} />
//       ))}
//     </div>
//   );
// }

// export default List;


// import { reducerCases } from "@/context/constants";
// import { useStateValue } from "@/context/StateContext";
// import { GET_INITAIL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
// import axios from "axios";
// import React, { useEffect } from "react";
// import ChatLIstItem from "./ChatLIstItem";

// function List() {
//   const [{ userInfo, userContacts }, dispatch] = useStateValue();

//   useEffect(() => {
//     const getContacts = async () => {
//       if (!userInfo?.id) {
//         // User info is not available yet, do not make the API call
//         return;
//       }

//       try {
//         const { data: { users, onlineUsers } } = await axios.get(`${GET_INITAIL_CONTACTS_ROUTE}/${userInfo.id}`);
//         dispatch({
//           type: reducerCases.SET_ONLINE_USERS,
//           onlineUsers
//         });
//         dispatch({
//           type: reducerCases.SET_USERS_CONTACTS,
//           userContacts: users
//         });
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     getContacts();
//   }, [userInfo, dispatch]);

//   return (
//     <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
//       {userContacts?.map((contact) => (
//         <ChatLIstItem data={contact} key={contact.id} />
//       ))}
//     </div>
//   );
// }

// export default List;
