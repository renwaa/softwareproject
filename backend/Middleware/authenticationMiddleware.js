const jwt = require("jsonwebtoken");
const secretKey = "jwreifbi238";

module.exports = function authenticationMiddleware(req, res, next) {
  const cookie = req.cookies;
  
  // console.log(req.headers);

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

    // Attach the decoded user ID to the request object for further use
    //console.log("this is auth middleware" , decoded.user)
    
    req.user = decoded.user;
    next();
  });
};