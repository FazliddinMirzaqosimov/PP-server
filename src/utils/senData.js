exports.sendError = (res, {error = "Somthing went wrong", status = 404,type="json"}) => {
  res.status(status)[type]({ status: "failed", error });
};
exports.sendSucces = (res, {data = {}, status = 200,type="json"}) => {
  res.status(status)[type]({ status: "success", data });
};
