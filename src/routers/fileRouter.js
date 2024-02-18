const express = require("express");
const FileControllers = require("../controllers/fileController");
const upload = require("../middlewares/fileUpload");
const { routeProtector } = require("../middlewares/routeProtector");
const { allowTo } = require("../middlewares/roleFilter");

const fileRouter = express.Router();
// console.log(upload.__proto__);
fileRouter
  .route("/")
  .get(FileControllers.getAll)
  .post(
    routeProtector,
    allowTo("superadmin", "admin"),
    upload("files", 20).array("files"),
    FileControllers.create
  );

fileRouter
  .route("/:id")
  .delete(FileControllers.delete)
  .get(FileControllers.get);

module.exports = fileRouter;
