const express = require("express");
const AuthControllers = require("../controllers/authController");
const VideoControllers = require("../controllers/videoController");
const { routeProtector } = require("../middlewares/routeProtector");

const videoRouter = express.Router();

videoRouter
  .route("/")
  .get(routeProtector, VideoControllers.getAll)
  .post(routeProtector, VideoControllers.create);

  videoRouter
  .route("/:id")
  .delete(routeProtector, VideoControllers.delete)
  .patch(routeProtector, VideoControllers.edit)
  .get(routeProtector, VideoControllers.get);

module.exports = videoRouter;
