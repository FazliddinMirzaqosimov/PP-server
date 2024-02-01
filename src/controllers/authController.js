const User = require("../models/userModel");
const { sendError, sendSucces } = require("../utils/senData");
const { passwordValidator } = require("../utils/validators/passwordValidator");
const generateToken = require("../utils/tokenGenerator");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, API_URL } = require("../shared/const");
const util = require("util");
const { sendRegisterEmail } = require("../utils/email");
const { v4: uuidv4 } = require("uuid");

class AuthControllers {
  static register = async (req, res) => {
    try {
      const { email, password } = req.body;
      const role = "user";

      const { isValid, message } = passwordValidator(password);

      if (!isValid) {
        return sendError(res, { error: message, status: 422 });
      }

      let user = await User.findOne({ email });

      if (user?.verifiedAt) {
        return sendSucces(res, {
          data: "Email already verified!",
          status: 200,
        });
      }

      if (!user) {
        user = await User.create({ email, password, role });
      }

      user.verificationCode = uuidv4();
      await user.save();
      console.log(
        `${API_URL}/api/v1/auth/email-verification?code=${user.verificationCode}&id=${user._id}`
      );
      await sendRegisterEmail(
        `${API_URL}/api/v1/auth/email-verification?code=${user.verificationCode}&id=${user._id}`,
        email
      );

      sendSucces(res, { data: "Email sent!", status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  }; 

  static login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return sendError(res, {
          error: "Please provide both password and email",
          status: 404,
        });
      }
      const user = await User.findOne({ email }).select("+password");

      if (!user?.verifiedAt) {
        return sendError(res, {
          error: "You are not verified!",
          status: 404,
        });
      }

      if (!user) {
        return sendError(res, {
          error: "Email not found",
          status: 404,
        });
      }
      if (!(await user.comparePasswords(password))) {
        return sendError(res, {
          error: "Wrong password or email",
          status: 404,
        });
      }

      const token = generateToken({ email, password });

      sendSucces(res, { data: { token, user }, status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  static activateEmail = async (req, res) => {
    try {
      const { code, id } = req.query;
      let user = await User.findById(id);
      if (!user) {
        return sendError(res, {
          error: "You did something shady!",
          type: "send",
          status: 404,
        });
      }
      if (user.verifiedAt) {
        return sendError(res, {
          error: "Your email already verified!",
          type: "send",
          status: 200,
        });
      }

      if (user.verificationCode === code) {
        user.verifiedAt = new Date();
        user.save();
        return sendSucces(res, {
          data: "Your email is verified! Now You can login!",
          type: "send",
          status: 200,
        });
      }
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };
}

module.exports = AuthControllers;
