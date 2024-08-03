import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyCRfM4GTW2MiwmBX4iGH_cjwaZcpFgqLBc",
    authDomain: "whatsappclone-df783.firebaseapp.com",
    projectId: "whatsappclone-df783",
    storageBucket: "whatsappclone-df783.appspot.com",
    messagingSenderId: "101799102375",
    appId: "1:101799102375:web:3cfef43b7b699788071882",
    measurementId: "G-RTYSSZD2G6"
  };

const app=initializeApp(firebaseConfig);
export const firebaseAuth=getAuth(app);  