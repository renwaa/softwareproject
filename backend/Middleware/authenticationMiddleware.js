const jwt = require("jsonwebtoken");
const secretKey = "xy27889pq";

module.exports = function authenticationMiddleware(req, res, next) {
  const cookie = req.cookies;

  
  // console.log(req.headers);

  if (!cookie) {
    return res.status(401).json({ message: "No Cookie provided" });
  }
  const authToken = req.headers.authorization;

    // Extract the token from the header
    const token = authToken.split(' ')[1];
  if (!token) {
    return res.status(405).json({ message: "No token provided" });
  }

  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Attach the decoded user ID to the request object for further use
    // console.log(decoded.user)
    
    req.user = decoded.user;
    next();
  });
};