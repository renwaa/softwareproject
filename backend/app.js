const express = require("express");
const cookieParser=require('cookie-parser')
const app = express();
const mongoose = require("mongoose");
const user = require("../backend/Routes/user");
const auth = require("../backend/Routes/auth");
const manager = require("../backend/Routes/manager");
const agent = require("../backend/Routes/agent");
const system = require("../backend/Routes/system");
require('dotenv').config();

const authenticationMiddleware = require("./Middleware/authenticationMiddleware");
const cors = require("cors");
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

app.use("/api/v1", auth);
app.use(authenticationMiddleware);
app.use("/api/v1/user", user);
app.use("/api/v1/manager", manager);
app.use("/api/v1/agent", agent);
app.use("/api/v1/system", system);
// app.use("/api/v1/viewAnalytics", managerRouter);
// app.use("/api/v1/createReports", managerRouter);


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