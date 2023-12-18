  const express = require("express");
  const app = express();
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
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'DELETE', 'PUT'],
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

  const mongoURI = 'mongodb://127.0.0.1:27017/SoftwareProject';
  mongoose.connect(mongoURI) .then(() => console.log("mongoDB connected"))
  .catch((e) => {
    console.log(e);
  });


    

  app.use(function (req, res, next) {
    return res.status(404).send("404");
  });
  app.listen(process.env.PORT, () => console.log("server started"));

