const User = require("../models/userModel");
const { sendError } = require("../utils/senData");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../shared/const");
const util = require("util");
const { senUserData } = require("../utils/botMessages");

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
      return sendError(res, { error: "Siz tizimga kirmagansiz", status: 401 });
    }

     const { id } = await util.promisify(jwt.verify)(
      token,
      JWT_SECRET
    );

    const user = await User.findById(id).select("+password") ;

    if (!user) {
      return sendError(res, { error: "Foydalanuvchi topilmadi", status: 404 });
    }
    if (!user.verifiedAt  && !["admin",'superadmin'].includes(user.role)) {
      return sendError(res, {
        error: "Siz tasdiqlanmagansiz!",
        status: 404,
      });
    }
    
    req.user = user;

     next();
  } catch (error) {
    sendError(res, { error: error.message, status: 404 });
  }
};
