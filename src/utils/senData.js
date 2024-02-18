const bot = require("../bot");
const { ADMINS_TGIDS } = require("../shared/const");

exports.sendError = (
  res,
  { error = "Somthing went wrong", status = 404, type = "json" }
) => {
  res
    .status(status)
    [type](type === "json" ? { status: "failed", error } : error);
};

exports.sendSucces = (res, { data = {}, status = 200, type = "json" }) => {
  res
    .status(status)
    [type](type === "json" ? { status: "success", data } : data);
};
