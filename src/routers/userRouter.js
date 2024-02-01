const express = require("express");
const UserControllers = require("../controllers/userController");
const AuthControllers = require("../controllers/authController");
const { routeProtector } = require("../middlewares/routeProtector");
const { allowTo } = require("../middlewares/roleFilter");

const userRouter = express.Router();

userRouter
  .route("/")
  .get(routeProtector, allowTo("superadmin"), UserControllers.getAll)
  .post(routeProtector, allowTo("superadmin"), UserControllers.create)
  .patch(routeProtector, UserControllers.editProfile);

userRouter
  .route("/balance")
  .get(routeProtector, allowTo("superadmin"), UserControllers.getBalance);
userRouter.route("/profile").get(routeProtector, UserControllers.getProfile);

userRouter
  .route("/add-course")
  .patch(routeProtector, UserControllers.addCourse);
userRouter
  .route("/remove-course")
  .delete(routeProtector, UserControllers.removeCourse);

userRouter.route("/buy-plan").post(routeProtector, UserControllers.buyPlan);
 
userRouter
  .route("/:id")
  .delete(routeProtector, allowTo("superadmin"), UserControllers.delete)
  .patch(routeProtector, allowTo("superadmin"), UserControllers.edit)
  .get(routeProtector, allowTo("superadmin"), UserControllers.get);

module.exports = userRouter;
