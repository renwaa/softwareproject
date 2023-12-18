const userModel = require("../Models/userModel");
const sessionModel = require("../Models/sessionModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const speakeasy = require('speakeasy');
const nodemailer = require("nodemailer");

const MFAController = {
  verifyMfa: async (req, res) => {
    try {
        const { mfaCode  , id} = req.body;

        const user = await userModel.findOne({_id : id });

      if (!mfaCode) {
        return res.status(405).send("MFA code not provided");
      }

      const mfaSecret = user.mfaSecret;
      console.log("mfaSecret " , user.mfaSecret)

      // const mfaVerified = speakeasy.totp.verify({
      //   secret: mfaSecret,
      //   encoding: "base32",
      //   token: mfaCode,
      // });

      // if (!mfaVerified) {
      //   return res.status(403).send("Invalid MFA code");
      // }

      if(mfaCode != user.mfaCode){
        return res.status(403).send("Invalid MFA code");
      }
      console.log("1111111")
      const currentDateTime = new Date();
      const expiresAt = new Date(+currentDateTime + 1800000); // expire in 3 minutes
      console.log("222222222")
      // Generate a JWT token
      const token = jwt.sign(
        { user: { userId: user._id, role: user.role, email: user.email } },
        secretKey,
        {
          expiresIn: 3 * 60 * 60,
        }
      );
      console.log("3333333333")

      let newSession = new sessionModel({
        userId: user._id,
        token,
        expiresAt: expiresAt,
      });

      await newSession.save();
      console.log("44444444444")
      //res has token has  cookie
      res.cookie("token", token, {
        expires: expiresAt,
        withCredentials: true,
        httpOnly: false,
        SameSite: "none",
      });
      console.log("44444444444")
      console.log("COOKIE FROM VERIFY MFA: " , token)

      // Respond with a success message
      res.status(200).send("Login successful");
    } catch (error) {
      console.error("Cannot Verify User", error);
      return res.status(500).send("Server error");
    }
  },

};

module.exports = MFAController;