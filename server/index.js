// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import AuthRoutes from "./routes/AuthRoutes.js";
// import MessageRoutes from "./routes/MessageRoutes.js";
// import { Server } from "socket.io";
// import path from "path";
// import { send } from "process";


// const __dirname = path.resolve();



// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(cors({
//   origin: '*', // Allow only this origin
//   methods: 'GET,POST', // Allow only these methods
//   allowedHeaders: 'Content-Type,Authorization' // Allow only these headers
// }));
// app.use(express.json());

// app.use('/uploads/recordings', express.static(path.join(__dirname, 'uploads/recordings')));
// app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));

// app.use('/api/auth', AuthRoutes);
// app.use('/api/messages', MessageRoutes);

// const server = app.listen(5001, () => {
//   console.log("Server started on port 5001");
// });

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// global.onlineUsers = new Map();

// io.on("connection", (socket) => {
//   global.chatSocket = socket;

//   socket.on("add-user", (userId) => {
//     onlineUsers.set(userId, socket.id);
//     socket.broadcast.emit("online-users",{
//       onlineUsers:Array.from(onlineUsers.keys())
//     });
//   });


//   socket.on("signout",(id)=>{
//     onlineUsers.delete(id);
//       socket.broadcast.emit("online-users",{
//         onlineUsers:Array.from(onlineUsers.keys())
//       });
//   })

//   socket.on("send-msg", (data) => {
//     const sendUserSocket = global.onlineUsers.get(data.to);
//     if (sendUserSocket) {
//       socket.to(sendUserSocket).emit("msg-receive", {
//         from: data.from,
//         message: data.message,
//       });
//     }
//   });


//   socket.on("outgoing-voice-call",(data)=>{
//     const sendUserSocket=global.onlineUsers.get(data.to);
//     if (sendUserSocket) {
//     socket.to(sendUserSocket).emit("incoming-voice-call", {
//       from:data.from,
//       roomId:data.roomId,
//       callType:data.callType
//     });
//   }
//   })


//   socket.on("outgoing-video-call",(data)=>{
//     const sendUserSocket=global.onlineUsers.get(data.to);
//     if (sendUserSocket) {
//     socket.to(sendUserSocket).emit("incoming-video-call", {
//       from:data.from,
//       roomId:data.roomId,
//       callType:data.callType
//     });
//   }
//   })

 
//   socket.on("reject-voice-call",(data)=>{
//     const sendUserSocket=global.onlineUsers.get(data.from);
//     if(sendUserSocket){
//       socket.to(sendUserSocket).emit("voice-call-rejected");
//     }

//   })

//   socket.on("reject-video-call",(data)=>{
//     console.log("reeerer")
//     const sendUserSocket=global.onlineUsers.get(data.from);
//     if(sendUserSocket){
//       socket.to(sendUserSocket).emit("video-call-rejected");
//     }

//   })

//   socket.on("accept-incoming-call",(id)=>{
//     const sendUserSocket=global.onlineUsers.get(id);
//       socket.to(sendUserSocket).emit("accept-call");
//   })

 
// });



import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import { Server } from "socket.io";
import path from "path";

const __dirname = path.resolve();

dotenv.config();
const app = express();

// Configure CORS to allow all origins
app.use(cors({
  origin: '*', // Allow all origins
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));

app.use(express.json());

app.use('/uploads/recordings', express.static(path.join(__dirname, 'uploads/recordings')));
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));

app.use('/api/auth', AuthRoutes);
app.use('/api/messages', MessageRoutes);

const server = app.listen(5001, () => {
  console.log("Server started on port 5001");
});

const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins
    methods: ["GET", "POST"],
    credentials: true
  }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("online-users", {
      onlineUsers: Array.from(onlineUsers.keys())
    });
  });

  socket.on("signout", (id) => {
    onlineUsers.delete(id);
    socket.broadcast.emit("online-users", {
      onlineUsers: Array.from(onlineUsers.keys())
    });
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", {
        from: data.from,
        message: data.message,
      });
    }
  });

  socket.on("outgoing-voice-call", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-voice-call", {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType
      });
    }
  });

  socket.on("outgoing-video-call", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-video-call", {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType
      });
    }
  });

  socket.on("reject-voice-call", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.from);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("voice-call-rejected");
    }
  });

  socket.on("reject-video-call", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.from);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("video-call-rejected");
    }
  });

  socket.on("accept-incoming-call", (id) => {
    const sendUserSocket = global.onlineUsers.get(id);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("accept-call");
    }
  });
});
