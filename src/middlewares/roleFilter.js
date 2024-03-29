const { sendError } = require("../utils/senData");

exports.allowTo =
  (...roles) =>
  (req, res,next  ) => {
    try {
      if (!roles.includes(req.user.role)) {
        return sendError(res, {
          error: "Bu yerga siz uchun ruxsat yo'q",
          status: 403,
        });
      }

      next();
    } catch (error) {
      sendError(res, { error:error.message, status: 404 });
    }
  };

exports.rejectTo =
  (...roles) =>
  (req, res, next) => {
    try {
      if (roles.includes(req.user.role)) {
        return sendError(res, {
          error: "Bu yerga siz uchun ruxsat yo'q",
          status: 403,
        });
      }

      next();
    } catch (error) {
      sendError(res, { error, status: 404 });
    }
  };
