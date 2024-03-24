const express = require("express");
const { routeProtector } = require("../middlewares/routeProtector");
const { allowTo } = require("../middlewares/roleFilter");
const ProgressControllers = require("../controllers/progressController");

const progressRouter = express.Router();

progressRouter.route("/:sectionId").get(routeProtector, ProgressControllers.get);
progressRouter
  .route("/next-video")
  .post(routeProtector, ProgressControllers.nextVideo);

module.exports = progressRouter;
