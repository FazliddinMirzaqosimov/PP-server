const User = require("../models/userModel");
const { sendError } = require("../utils/senData");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../shared/const");
const util = require("util");

exports.routeProtector = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return sendError(res, { error: "You are not logged in", status: 401 });
    }

     const { email, password } = await util.promisify(jwt.verify)(
      token,
      JWT_SECRET
    );

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return sendError(res, { error: "Wrong email", status: 404 });
    }
    if (!user.verifiedAt) {
      return sendError(res, {
        error: "You are not verified!",
        status: 404,
      });
    }
    if (!(await user.comparePasswords(password))) {
      return sendError(res, { error: "Wrong password  ", status: 404 });
    }
    req.user = user;

    next();
  } catch (error) {
    sendError(res, { error: error.message, status: 404 });
  }
};
