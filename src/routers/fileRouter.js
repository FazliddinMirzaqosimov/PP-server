const express = require("express");
const FileControllers = require("../controllers/fileController");
const upload = require("../middlewares/fileUpload");

const fileRouter = express.Router();
// console.log(upload.__proto__);
fileRouter
  .route("/")
  .get(FileControllers.getAll)
  .post(upload.array("files"), FileControllers.create);

fileRouter
  .route("/:id")
  .delete(FileControllers.delete)
  .get(FileControllers.get);

module.exports = fileRouter;
 