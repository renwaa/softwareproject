const express = require("express");
const app = express();
const http = require("http");
// const socketIO = require("socket.io");
const server = http.createServer(app);
// const io = socketIO(server);
const cookieParser=require('cookie-parser')

const mongoose = require("mongoose");
const realTimeChatRouter = require("../backend/Routes/realTimeChatRouter");
const userRouter = require("../backend/Routes/userRouter");
const agentRouter = require("../backend/Routes/agentRouter");
const authRouter = require("../backend/Routes/authRouter");
const systemRouter = require("../backend/Routes/systemRouter");
const MFARouter = require("../backend/Routes/MFARouter");
require('dotenv').config();

const authenticationMiddleware = require("./Middleware/authenticationMiddleware");
const cors = require("cors");
const systemController = require("./Controller/systemController");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser())

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);


//routes 
app.use("/api/v1", authRouter);
app.use("/api/v1" ,MFARouter);
app.use(authenticationMiddleware);
app.use("/api/v1" ,userRouter );
app.use("/api/v1" ,agentRouter );
app.use("/api/v1" ,realTimeChatRouter );
app.use("/api/v1" ,systemRouter);

const db_name = process.env.DB_NAME;
const db_url = `${process.env.DB_URL}/${db_name}`; // if it gives error try to change the localhost to 127.0.0.1


// ! Mongoose Driver Connection
const connectionOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const mongoURI = 'mongodb://127.0.0.1:27017/softwareProject';
mongoose.connect(mongoURI) .then(() => console.log("mongoDB connected"))
.catch((e) => {
  console.log(e);
});


  

app.use(function (req, res, next) {
  return res.status(404).send("404");
});
app.listen(process.env.PORT, () => console.log("server started"));


// Socket.io setup
// io.on("connection", (socket) => {
//   console.log("A user connected");

  // Handle real-time chat events here
  // socket.on("join-chat", (chatId) => {
  //   socket.join(chatId);
  //   console.log('User joined chat: ${chatId}');
  // });

  // socket.on("leave-chat", (chatId) => {
  //   socket.leave(chatId);
  //   console.log('User left chat: ${chatId}');
  // });

//   // Inside the "send-message" event handling
// socket.on('send-message', async (data) => {
//   try {
//     // Save the message to the database
//     const message = await messageController.saveMessage(data.chatId, data.message, data.createdBy);

//     // Emit the message to all users in the chat
//     io.to(data.chatId).emit('receive-message', message);
//   } catch (error) {
//     console.error('Error saving message:', error.message);
//   }
// });

  // socket.on("disconnect", () => {
  //   console.log("User disconnected");
  // });
// });
