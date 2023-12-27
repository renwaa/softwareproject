const jwt = require("jsonwebtoken");
const secretKey = "jwreifbi238";
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// Use cookie-parser middleware
app.use(cookieParser());

module.exports = function authenticationMiddleware(req, res, next) {
  const cookie = req.cookies;
  // Rest of the middleware...
  if (!cookie) {
    return res.status(401).json({ message: "No Cookie provided" });
  }
  const token = cookie.token;
  if (!token) {
    return res.status(405).json({ message: "No token provided" , token , cookie });
  }

  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: "Invalid token" });
    }
    
    req.user = decoded.user;
    next();
  });
};