const User = require("../models/userModel");
const { sendError, sendSucces } = require("../utils/senData");
const { passwordValidator } = require("../utils/validators/passwordValidator");
const generateToken = require("../utils/tokenGenerator");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../shared/const");
const util = require("util");

class AuthControllers {
  static register = async (req, res) => {
    try {
      const { email, password } = req.body;
      const role = "user";

      const { isValid, message } = passwordValidator(password);

      if (!isValid) {
        return sendError(res, { error: message, status: 422 });
      }
      const user = await User.create({ email, password, role });

      const token = generateToken({ email, password });

      sendSucces(res, { data: { token, user }, status: 200 });
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

  

  
}

module.exports = AuthControllers;
