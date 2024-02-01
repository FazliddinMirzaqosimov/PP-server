const User = require("../models/userModel");
const { sendError, sendSucces } = require("../utils/senData");
const { passwordValidator } = require("../utils/validators/passwordValidator");
const generateToken = require("../utils/tokenGenerator");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, API_URL } = require("../shared/const");
const util = require("util");
const { sendRegisterEmail, sendUpdateEmailCode } = require("../utils/email");
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
      if (!user) {
        return sendError(res, {
          error: "Email not found",
          status: 404,
        });
      }
      if (!user.verifiedAt) {
        return sendError(res, {
          error: "You are not verified!",
          status: 404,
        });
      }

      if (!(await user.comparePasswords(password))) {
        return sendError(res, {
          error: "Wrong password",
          status: 404,
        });
      }

      const token = generateToken({ id: user._id });

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
        await user.save();
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

  static updatePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;

      if (newPassword === oldPassword) {
        return sendError(res, {
          error: "New password cannot be equal to old password",
          status: 404,
        });
      }
      const { isValid, message } = passwordValidator(newPassword);

      if (!isValid) {
        return sendError(res, {
          error: message,
          status: 404,
        });
      }

      let user = req.user;

      if (!(await user.comparePasswords(oldPassword))) {
        return sendError(res, {
          error: "Wrong password",
          status: 404,
        });
      }
      user.password = newPassword;
      await user.save();
      sendSucces(res, { data: "Password updated!", status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  static sendNewEmailCode = async (req, res) => {
    try {
      const { newEmail } = req.body;

      if (!newEmail) {
        return sendError(res, {
          error: "newEmail is required!",
          status: 400,
        });
      }
      if (req.user.email === newEmail) {
        return sendError(res, {
          error: "You cant change your email to your current email!",
          status: 400,
        });
      }
      const userWithNewEmail = await User.findOne({ email: newEmail });
      // console.log(userWithNewEmail);
      if (userWithNewEmail) {
        return sendError(res, {
          error: "Email already exist!",
          status: 409,
        });
      }
      const user = req.user;
      const newEmailCode = String(Math.floor(Math.random() * 1000000)).padStart(
        6,
        0
      );

      user.newEmail = newEmail;
      user.newEmailCode = newEmailCode;
      await user.save();

      sendUpdateEmailCode(newEmailCode, newEmail);
      sendSucces(res, {
        data: `We sent verification code to your new email: ${newEmail}`,
        status: 200,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };
  static updateEmail = async (req, res) => {
    try {
      const { code } = req.body;

      if (!code) {
        return sendError(res, {
          error: "code is required!",
          status: 400,
        });
      }
      const user = req.user;
      if (code != user.newEmailCode) {
        return sendError(res, {
          error: "code didnt match!",
          status: 400,
        });
      }
      user.email = user.newEmail;
      user.newEmail = undefined;
      user.newEmailCode = undefined;
       await user.save();
       sendSucces(res, {
        data: `Your email successfully changed`,
        status: 200,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };
}

module.exports = AuthControllers;
