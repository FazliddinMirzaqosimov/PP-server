const { BUCKET_NAME } = require("../shared/const");
 const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3 } = require("../utils/s3");
 
const multerStorage = multerS3({
  s3,
  bucket:  BUCKET_NAME,
  acl: "public-read",
  metadata: function (req, file, cb) {
    cb(null, { fieldname: file.fieldname });
  },
  key: function (req, file, cb) {
    console.log(file);
    cb(
      null,
      `${Math.floor(Math.random() * 1000)}-${Date.now()}-${file.originalname}`
    );
  },
});

// const multerFilter = (req, file, cb) => {
//   cb(null, true);
// };

const upload = multer({ storage: multerStorage });

exports.upload = upload;
 