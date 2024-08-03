// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { useStateValue } from "@/context/StateContext";
// import Input from "@/components/common/Input";
// import Avatar from "@/components/common/Avatar";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";


// function onboarding() {
//   const router=useRouter();
//   const [{userInfo,newUser}]=useStateValue();
//   const [name, setname] = useState(userInfo?.name || " ")
//   const [about, setabout] = useState("");
//   const [image, setimage] = useState("/default_avatar.png")


// useEffect(() => {
//   if(!newUser && !userInfo?.email){
//          router.push("/login")
//   }else if(!newUser && userInfo?.email)
//   {
//     router.push("/")
//   }
// }, [newUser,userInfo,router])




//   const onboardUserHandle=async()=>{
//     if(validateDetails){
//       const email=userInfo.email;
//       try {
//         console.log("{data}")
//         const {data}=await axios.post(ONBOARD_USER_ROUTE,{email,name,about,image});
//         console.log("{data}")
//         console.log({data})
//         if(data.status){
//           dispatch({
//             type: reducerCases.SET_NEW_USER,
//             newUser: true,
//           });
//           dispatch({
//             type: reducerCases.SET_USER_INFO,
//             userInfo: {
//               id:data.id,
//               name,
//               email,
//               profileImage:image,
//               status: about,
//             },
            
//           });
//           router.push("/chat");
//         }
        
//       } catch (error) {
        
//       }
//      }
//   }

//   const validateDetails=()=>{
//     if(name.length<3){
//       return false;
//     }
//     return true;
//   }


//   return (
//     <div
//       className="bg-panel-header-background h-screen w-screen text-white flex flex-col justify-center
//    items-center"
//     >
//        <div className="flex items-center justify-center gap-2">
//         <Image src="/whatsapp.gif" width={300} height={300} />
//         <span className="text-7xl font-medium">WhatsApp</span>
//       </div>
//       <h2 className="text-2xl ">Create Your Profile</h2>
//       <div className="flex mt-6 gap-6">
//         <div className="flex flex-col items-center justify-center mt-5 gap-6">
//           <Input name="Display Name" state={name} setState={setname} label={true} />
//           <Input name="About" state={about} setState={setabout} label={true} />
//           <div className="flex items-center justify-center">
//            <button  
//            onClick={()=>onboardUserHandle()}
//            className="flex justify-center items-center bg-search-input-container-background p-5 rounded-lg"
//            >
//             Create Profile
//            </button>
//           </div>
//         </div>
//         <div>
//           <Avatar type="xl" image={image} setImage={setimage} />
//         </div>
//       </div> 
//     </div>
//   );
// }

// export default onboarding;



import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useStateValue } from "@/context/StateContext";
import Input from "@/components/common/Input";
import Avatar from "@/components/common/Avatar";
import axios from "axios";
import { useRouter } from "next/router";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";

function Onboarding() {
  const router = useRouter();
  const [{ userInfo, newUser }, dispatch] = useStateValue();
  const [name, setName] = useState(userInfo?.name || "");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("/default_avatar.png");

  useEffect(() => {
    if (!newUser && !userInfo?.email) {
      router.push("/login");
    } else if (!newUser && userInfo?.email) {
      router.push("/");
    }
  }, [newUser, userInfo, router]);

  const onboardUserHandle = async () => {
    if (validateDetails()) {
      const email = userInfo.email;
      try {
        const { data } = await axios.post(ONBOARD_USER_ROUTE, { email, name, about, image });
        if (data.status) {
          dispatch({
            type: reducerCases.SET_NEW_USER,
            newUser: false,
          });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id: data.id,
              name,
              email,
              profileImage: image,
              status: about,
            },
          });
          router.push("/");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const validateDetails = () => {
    return name.length >= 3;
  };

  return (
    <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col justify-center items-center">
      <div className="flex items-center justify-center gap-2">
        <Image src="/whatsapp.gif" width={300} height={300} />
        <span className="text-7xl font-medium">WhatsApp</span>
      </div>
      <h2 className="text-2xl ">Create Your Profile</h2>
      <div className="flex mt-6 gap-6">
        <div className="flex flex-col items-center justify-center mt-5 gap-6">
          <Input name="Display Name" state={name} setState={setName} label={true} />
          <Input name="About" state={about} setState={setAbout} label={true} />
          <div className="flex items-center justify-center">
            <button
              onClick={onboardUserHandle}
              className="flex justify-center items-center bg-search-input-container-background p-5 rounded-lg"
            >
              Create Profile
            </button>
          </div>
        </div>
        <div>
          <Avatar type="xl" image={image} setImage={setImage} />
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
