const express = require("express");
const CourseControllers = require("../controllers/courseController");
const AuthControllers = require("../controllers/authController");
const { routeProtector } = require("../middlewares/routeProtector");

const courseRouter = express.Router();

courseRouter
  .route("/")
  .get(CourseControllers.getAll)
  .post(routeProtector, CourseControllers.create);

courseRouter
  .route("/:id")
  .delete(routeProtector, CourseControllers.delete)
  .patch(routeProtector, CourseControllers.edit)
  .get(CourseControllers.get);

module.exports = courseRouter;
