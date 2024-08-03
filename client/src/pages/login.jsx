// import { reducerCases } from "@/context/constants";
// import { useStateValue } from "@/context/StateContext";
// import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
// import { firebaseAuth } from "@/utils/FirebaseConfig";
// import axios from "axios";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import Image from "next/image";
// import { useRouter } from "next/router";
// import React, { useEffect } from "react";
// import { FcGoogle } from "react-icons/fc";

// function login() {
//   const router = useRouter();
//   const [{userInfo,newUser}, dispatch] = useStateValue();

//   useEffect(() => {
//     if(userInfo?.id || !newUser) router.push('/')
//   }, [userInfo,newUser])
  

//   const handlelogin = async () => {
//     const provider = new GoogleAuthProvider();
//     const {
//       user: { displayName: name, email, photoUrl: profileImage },
//     } = await signInWithPopup(firebaseAuth, provider);

//     try {
//       if (email) {
//         const { data } = await axios.post(CHECK_USER_ROUTE, { email });
//         console.log(data);
//       router.push("/onboarding")
//         // if (!data.status) {
//         //   dispatch({
//         //     type: reducerCases.SET_NEW_USER,
//         //     newUser: true,
//         //   });
//         //   dispatch({
//         //     type: reducerCases.SET_USER_INFO,
//         //     userInfo: {
//         //       name,
//         //       email,
//         //       profileImage,
//         //       status: "",
//         //     },
//         //   });
//         //   alert("onnnnn")
//         //   router.push("/onboarding");
//         // }else{
//         //   dispatch({
//         //     type: reducerCases.SET_USER_INFO,
//         //     userInfo: {
//         //       id:data.data.id,
//         //       name:data.data.name,
//         //       email:data.data.email,
//         //       profileImage:data.data.profileImage,
//         //       status:data.data.status,
//         //     },
//         //   });
//         //   router.push('/')
//         // }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center bg-panel-header-background w-screen h-screen flex-col">
//       <div className="flex justify-center items-center gap-2 text-white">
//         <Image src={"/whatsapp.gif"} width={300} height={300} />
//         <span className="text-7xl font-medium">WhatsApp</span>
//       </div>
//       <button
//         className="flex justify-center items-center bg-search-input-container-background p-5 rounded-lg"
//         onClick={handlelogin}
//       >
//         <FcGoogle className="text-4xl"></FcGoogle>
//         <span className="text-white text-2xl ">Login With Google</span>
//       </button>
//     </div>
//   );
// }

// export default login;



import { reducerCases } from "@/context/constants";
import { useStateValue } from "@/context/StateContext";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

function Login() {
  const router = useRouter();
  const [{ userInfo, newUser }, dispatch] = useStateValue();

  useEffect(() => {
    if (userInfo?.id) {
      router.push('/');
    } else if (newUser) {
      router.push('/onboarding');
    }
  }, [userInfo, newUser, router]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const {
      user: { displayName: name, email, photoURL: profileImage },
    } = await signInWithPopup(firebaseAuth, provider);

    try {
      if (email) {
        const { data } = await axios.post(CHECK_USER_ROUTE, { email });
        if (!data.status) {
          dispatch({
            type: reducerCases.SET_NEW_USER,
            newUser: true,
          });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: { name, email, profileImage, status: "" },
          });
          router.push("/onboarding");
        } else {
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id: data.data.id,
              name: data.data.name,
              email: data.data.email,
              profileImage: data.data.profileImage,
              status: data.data.status,
            },
          });
          router.push('/');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center bg-panel-header-background w-screen h-screen flex-col">
      <div className="flex justify-center items-center gap-2 text-white">
        <Image src={"/whatsapp.gif"} width={300} height={300} />
        <span className="text-7xl font-medium">WhatsApp</span>
      </div>
      <button
        className="flex justify-center items-center bg-search-input-container-background p-5 rounded-lg"
        onClick={handleLogin}
      >
        <FcGoogle className="text-4xl" />
        <span className="text-white text-2xl ">Login With Google</span>
      </button>
    </div>
  );
}

export default Login;
