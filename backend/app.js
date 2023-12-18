const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
// const userModel = require("../backend/Models/userModel");
// const messageModel = require("../backend/Models/messageModel");
// const messageController = require("../backend/Controller/messageController");
// const realTimeChatController = require("../backend/Controller/realTimeChatController");
// const userController = require("../backend/Controller/userController")
const authRouter = require("../backend/Routes/authRouter");
const userRouter = require("../backend/Routes/userRouter");
const adminRouter = require("../backend/Routes/adminRouter");
const realTimeChatRouter = require("../backend/Routes/realTimeChatRouter");
const agentRouter = require("../backend/Routes/agentRouter");
const systemRouter = require("../backend/Routes/systemRouter");
const MFARouter = require("../backend/Routes/MFARouter");
const messageRouter = require("../backend/Routes/messageRouter");
const authenticationMiddleware = require("../backend/Middleware/authenticationMiddleware");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

// Mongoose connection setup
const connectionOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
const db_name = process.env.DB_NAME;
const db_url = `${process.env.DB_URL}/${db_name}`;

mongoose
  .connect(db_url, connectionOptions)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => {
    console.log(e);
  });


// Routes setup
app.use("/api/v1", authRouter);
app.use(authenticationMiddleware); // Place this middleware before routes that require authentication
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/realTimeChat", realTimeChatRouter);
app.use("/api/v1/agent", agentRouter);
app.use("/api/v1/system", systemRouter);
app.use("/api/v1/MFA", MFARouter);
app.use("/api/v1/message", messageRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



