const express = require("express");
const FileControllers = require("../controllers/fileController");
const upload = require("../middlewares/fileUpload");
const { routeProtector } = require("../middlewares/routeProtector");
const { allowTo } = require("../middlewares/roleFilter");

const fileRouter = express.Router();

fileRouter
  .route("/")
  .get(FileControllers.getAll)
 

fileRouter
  .route("/:id")
  .delete(FileControllers.delete)
  .get(FileControllers.get);

module.exports = fileRouter;
