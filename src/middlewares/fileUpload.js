const {
  BUCKET_NAME,
  BUCKET_FOLDER_NAME,
  imageExtensions,
} = require("../shared/const");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3 } = require("../utils/s3");
const { v4: uuidv4 } = require("uuid");

const upload = (folderName, mb = 0.4) => {
  const multerStorage = multerS3({
    s3,
    bucket: BUCKET_NAME,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldname: file.fieldname });
    },
    key: function (req, file, cb) {
      const fileNameList = file.originalname.split(".");
      const extension = fileNameList[fileNameList.length - 1];

      cb(
        imageExtensions.includes(extension) ? null : "Should be image!",
        `${BUCKET_FOLDER_NAME}/${folderName}/${uuidv4()}.${extension}`
      );
    },
  });

  return multer({
    storage: multerStorage,
    limits: { fileSize: mb * 1024 * 1024 },
  });
};

module.exports = upload;
