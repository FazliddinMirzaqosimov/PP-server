const express = require("express");
const UserControllers = require("../controllers/userController");
const AuthControllers = require("../controllers/authController");
const { routeProtector } = require("../middlewares/routeProtector");

const userRouter = express.Router();

userRouter
  .route("/")
  .get(routeProtector, UserControllers.getAll)
  .post(routeProtector, UserControllers.create);
  
  userRouter
  .route("/balance")
  .get(routeProtector, UserControllers.getBalance)

  userRouter
  .route("/:id")
  .delete(routeProtector, UserControllers.delete)
  .patch(routeProtector, UserControllers.edit)
  .get(routeProtector, UserControllers.get);

module.exports = userRouter;
