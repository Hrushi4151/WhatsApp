
// import getprismaInstance from "../utils/PrismaClient.js";



// export const checkUser=async(req,res,next)=>{
//     try {
//         const {email}=req.body;
//         if(email){
//             return res.json({msg:"Email is Required",status:false});
//         }
//         const prisma=getprismaInstance();
//         const user=await prisma.user.findUnique({where:{email}});
//         if(!user){
//             return res.json({msg:"User not Found",status:false});
//         }else{
//             return res.json({msg:"User  Found",status:true,data:user});
//         }
//     } catch (error) {
//         next(error)
//     }
// }:

import getPrismaInstance from "../utils/PrismaClient.js";
import {generateToken04} from "../utils/TokenGenerator.js"


export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email)
    if (!email) {
      return res.json({ msg: "Email is required", status: false });
    }

    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({ where: { email } });
    console.log("user")
    if (!user) {
      return res.json({ msg: "User not found", status: false });
    } else {
      return res.json({ msg: "User found", status: true, data: user });
    }
  } catch (error) {
    next(error);
    console.log(error)
  }
};


export const onboardUser=async (req,res,next)=>{
    try {
      const {email,name,about,image:profileImage}=req.body;
      console.log(email,name)
      if(!email || !name || !about || !profileImage){
        return res.json("Email,Name,Image is Required")
      }
      const prisma=getPrismaInstance();
      const user=await prisma.user.create({data:{
        email,name,about,profileImage
        }});
        return res.json({msg:"User Created",status:true,data:user})

    } catch (error) {
      next(error)
    }
}

export const getAllUsers=async(req,res,next)=>{
  try {
    const prisma=getPrismaInstance();
    const users=await prisma.user.findMany({orderBy:{name:"asc"},
    select:{
      id:true,
      name:true,
      email:true,
      about:true,
      profileImage:true
    }
    });
    console.log(users)
    const usersGroupInit={};
    users.forEach(user => {
      const initLetter=user.name.charAt(0).toUpperCase();
      if(!usersGroupInit[initLetter]){
        usersGroupInit[initLetter]=[]
        }
      usersGroupInit[initLetter].push(user)
      
    });
    
    return res.json({msg:"Users Found",status:true,users:usersGroupInit})
    
  } catch (error) {
     next(error)
  }
}



export const generateToken=(req,res,next)=>{
  try {
    const appId=parseInt(process.env.ZEGO_APP_ID);
    const serverSecret=process.env.ZEGO_SERVER_ID;
    const userId=req.params.userId
    const effectiveTime=3600;
    const payload=""
    if(appId && serverSecret && userId){
      const token=generateToken04(appId,userId,serverSecret,effectiveTime,payload);
      return res.status(200).json({token});
    }
    return res.status(400).send("UserId App Id ServerSecret Required");
  } catch (error) {
    next(error)
  }
}