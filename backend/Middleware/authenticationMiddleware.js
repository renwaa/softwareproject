/*const jwt = require("jsonwebtoken");
const secretKey = "abcdefg";

module.exports = function authenticationMiddleware(req, res, next) {
  const cookie = req.cookies;
  
  // console.log(req.headers);

  if (!cookie) {
    return res.status(401).json({ message: "No Cookie provided" });
  }
  const token = cookie.token;
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
};*/

const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const secretKey = "abcdefg";

module.exports = function authenticationMiddleware(req, res, next) {
  const cookie = req.cookies;
  
  // console.log(req.headers);

  if (!cookie) {
    return res.status(401).json({ message: "No Cookie provided" });
  }
  const token = cookie.token;
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

     if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const user = req.user;

  // Check if MFA is enabled for the user
  if (user.mfaEnabled) {
    const mfaToken = cookie.mfaToken;

    if (!mfaToken) {
      return res.status(405).json({ message: "MFA token not provided" });
    }

    const mfaSecret = user.mfaSecret;

    const mfaVerified = speakeasy.totp.verify({
      secret: mfaSecret,
      encoding: "base32",
      token: mfaToken,
    });

    if (!mfaVerified) {
      return res.status(403).json({ message: "Invalid MFA token" });
    }
  }
    next();
  });
};