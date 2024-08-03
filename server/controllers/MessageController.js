// import getprismaInstance from "../utils/PrismaClient.js"

// export const addMessage=async(req,res,next)=>{

//     try {
//         const prisma=getprismaInstance();
//         const {message,from,to}=req.body;
//         console.log(message,from,to)
//         const getUser=onlineUsers.get(to);
//        console.log(getUser)
//         if(message && from && to){
//             const newMessage=await prisma.messages.create({
//                 data:{
//                     message,
//                     sender:{connect:{id:from}},
//                     receiver:{connect:{id:to}},
//                     messageStatus:getUser?"delivered":"sent",
//             },
//             include:{
//                 sender:true,receiver:true,
//             }
//         })
//         return res.status(201).send({message:newMessage})
//     }
//     return res.status(400).send({message:"From and To : Meaasge is Required"})

//     } catch (error) {
//         next(error)
//     }

// }

import getPrismaInstance from "../utils/PrismaClient.js";
import { renameSync } from "fs";

export const addMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { message, from, to } = req.body;
    console.log(message, from, to);
    const getUser = onlineUsers.get(to);
    console.log(getUser);
    if (message && from && to) {
      const newMessage = await prisma.messages.create({
        data: {
          message,
          sender: { connect: { id: from } },
          receiver: { connect: { id: to } },
          messageStatus: getUser ? "delivered" : "sent",
        },
        include: {
          sender: true,
          receiver: true,
        },
      });
      return res.status(201).send({ message: newMessage });
    }
    return res
      .status(400)
      .send({ message: "From and To: Message is Required" });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();

    const { from, to } = req.params;

    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          {
            senderId: from,
            receiverId: to,
          },
          {
            senderId: to,
            receiverId: from,
          },
        ],
      },
      orderBy: {
        id: "asc",
      },
    });

    const unreaadMessages = [];

    messages.forEach((message, index) => {
      if (message.messageStatus !== "read" && message.senderId === to) {
        messages[index].messageStatus = "read";
        unreaadMessages.push(message.id);
      }
    });

    await prisma.messages.updateMany({
      where: {
        id: { in: unreaadMessages },
      },
      data: {
        messageStatus: "read",
      },
    });

    res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};

export const addImageMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const data = Date.now();
      let fileName = "uploads/images/" + data + req.file.originalname;
      console.log(fileName, req.file.path);
      renameSync(req.file.path, fileName);
      const prisma = getPrismaInstance();
      const { from, to } = req.query;
      if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            sender: { connect: { id: from } },
            receiver: { connect: { id: to } },
            type: "image",
          },
        });
        return res.status(201).json({ message });
      }
      return res.status(400).send("From to is Required");
    }
    return res.status(400).send("Image is Required");
  } catch (error) {
    next(error);
  }
};

export const addAudioMessgae = async (req, res, next) => {
  try {
    if (req.file) {
      const data = Date.now();
      let fileName = "uploads/recordings/" + data + req.file.originalname;
      console.log(fileName, req.file.path);
      renameSync(req.file.path, fileName + ".mp3");
      const prisma = getPrismaInstance();
      const { from, to } = req.query;
      if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            sender: { connect: { id: from } },
            receiver: { connect: { id: to } },
            type: "audio",
          },
        });
        return res.status(201).json({ message });
      }
      return res.status(400).send("From to is Required");
    }
    return res.status(400).send("Audio is Required");
  } catch (error) {
    next(error);
  }
};




export const getInitailContactsWithMessages = async (req, res, next) => {
  try {
    const userId = req.params.from;
    console.log("ddfdfdd::",userId)
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        sentMessages: {
          include: {
            receiver: true,
            sender: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        receivedMessages: {
          include: {
            receiver: true,
            sender: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    const messages = [ ...user.sentMessages, ...user.receivedMessages ];
    messages.sort((a, b) => b.createdAt.getTime() > a.createdAt.getTime());
    const users = new Map();
    const messageStatusChange = [];
    messages.forEach((msg) => {
      const isSender = msg.senderId === userId;
      const calculatedId = isSender ? msg.receiverId : msg.senderId;
      if (msg.messageStatus === "sent") {
        messageStatusChange.push(calculatedId);
      }

      const {
        id,
        type,
        message,
        messageStatus,
        createdAt,
        senderId,
        receiverId,
      } = msg;
      if (!users.get(calculatedId)) {
        let user = {
          messageId: id,
          type,
          message,
          messageStatus,
          createdAt,
          senderId,
          receiverId,
        };
        if (isSender) {
          user = {
            ...user,
            ...msg.receiver,
            totalUnreadMessages: 0,
          };
        } else {
          user = {
            ...user,
            ...msg.sender,
            totalUnreadMessages: messageStatus !=="read" ? 1 : 0 ,
          };
        }
        users.set(calculatedId,{...user})
      } else if ( messageStatus !== "read" && !isSender) {
        const user = users.get(calculatedId);
        users.set(calculatedId, {
          ...user,
          totalUnreadMessages: user.totalUnreadMessages + 1,
        });
      }
    });

    if(messageStatusChange.length){
      await prisma.messages.updateMany({
        where: {
          id: { in: messageStatusChange },
        },
        data: {
          messageStatus: "delivered",
        },
      });
    }
    return res.status(200).json({ user:Array.from(users.values()) ,
      onlineUsers:Array.from(onlineUsers.keys())
    });
  } catch (error) {
    next(error);
  }
};
