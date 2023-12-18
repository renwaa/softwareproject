const express = require("express");
const cookieParser=require('cookie-parser')
const app = express();
const mongoose = require("mongoose");
const agentRouter = require ("../backend/Routes/agentRouter");
const userRouter = require("../backend/Routes/userRouter");
// const userRouter = require("./Routes/users");
const authRouter = require("../backend/Routes/auth");
require('dotenv').config();

const authenticationMiddleware = require("./Middleware/authenticationMiddleware");
const cors = require("cors");
const authorizationMiddleware = require("./Middleware/authorizationMiddleware");
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

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS,HEAD");
//   res.setHeader(
//     "Access-Control-Expose-Headers",
//     "*"
//   );

//   next();
// });

app.use("/api/v1", authRouter);
app.use(authenticationMiddleware);

app.use("/api/v1", agentRouter);
app.use("/api/v1/user", userRouter);
app.use(authorizationMiddleware);
// app.use("/api/v1/users",userRouter);


const db_name = process.env.DB_NAME;
// * Cloud Connection
// const db_url = `mongodb+srv://TestUser:TestPassword@cluster0.lfqod.mongodb.net/${db_name}?retryWrites=true&w=majority`;
// * Local connection
const db_url = `${process.env.DB_URL}/${db_name}`; // if it gives error try to change the localhost to 127.0.0.1

// ! Mongoose Driver Connection

const connectionOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose
  .connect(db_url, connectionOptions)
  .then(() => console.log("mongoDB connected"))
  .catch((e) => {
    console.log(e);
  });

app.use(function (req, res, next) {
  return res.status(404).send("404");
});
app.listen(process.env.PORT, () => console.log("server started"));