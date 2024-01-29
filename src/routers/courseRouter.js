const express = require("express");
const CourseControllers = require("../controllers/courseController");
const AuthControllers = require("../controllers/authController");
const { routeProtector } = require("../middlewares/routeProtector");
const { allowTo } = require("../middlewares/roleFilter");

const courseRouter = express.Router();

courseRouter
  .route("/")
  .get(CourseControllers.getAll)
  .post(routeProtector,allowTo("admin","superadmin"), CourseControllers.create);

courseRouter
  .route("/:id")
  .delete(routeProtector,allowTo("admin","superadmin"), CourseControllers.delete)
  .patch(routeProtector,allowTo("admin","superadmin"), CourseControllers.edit)
  .get(CourseControllers.get);

module.exports = courseRouter;
