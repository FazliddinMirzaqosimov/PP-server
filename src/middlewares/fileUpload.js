const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const upload = (folderName, mb = 0.4) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (!req?.user?._id) {
        cb("Cannot find user!");
      }
      const uploadPath = `/uploads/${folderName}`;
      const dir = path.join(__dirname, `../..${uploadPath}`);

      req.uploadPath = uploadPath;
      fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
          cb("Cannot create folder!");
          return;
        }
        cb(null, dir);
      });
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(".");
      const extension = fileName[fileName.length - 1];
      const name = `${uuidv4()}.${extension}`;
      req.uploadPath = `${req.uploadPath}/${name}`;
      cb(null, name);
    },
  });

  return multer({
    storage: storage,
    limits: { fileSize: mb * 1024 * 1024 },
  });
};

module.exports = upload;
