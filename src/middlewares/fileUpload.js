const { BUCKET_NAME, BUCKET_FOLDER_NAME } = require("../shared/const");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3 } = require("../utils/s3");
const { v4: uuidv4 } = require("uuid");

const multerStorage = multerS3({
  s3,
  bucket: BUCKET_NAME,
  acl: "public-read",
  metadata: function (req, file, cb) {
    cb(null, { fieldname: file.fieldname });
  },
  key: function (req, file, cb) {
    const fileNameList = file.originalname.split(".");
    cb(
      null,
      `${BUCKET_FOLDER_NAME}/${uuidv4()}.${
        fileNameList[fileNameList.length - 1]
      }`
    );
  },
});

const upload = multer({ storage: multerStorage });

module.exports = upload;
