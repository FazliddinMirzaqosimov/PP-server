const { BUCKET_NAME } = require("../../shared/const");
const { s3 } = require("./index");
const fs = require("fs");

//set delete param bucket name and file name with extension
exports.deleteFile = (uploadPath) => {
   fs.unlinkSync(uploadPath.replace("/", ""), console.dir);
  // const param = {
  //   Bucket:  BUCKET_NAME,
  //   Key: fileName,
  // };

  // s3.deleteObject(param, function (err, data) {
  //   if (err) {
  //     console.log("err", err);
  //   }
  //   console.log("data", data);
  // });
};
