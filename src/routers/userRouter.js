const express = require("express");
const UserControllers = require("../controllers/userController");
const AuthControllers = require("../controllers/authController");

const userRouter = express.Router();

userRouter
  .route("/")
  .get(AuthControllers.routeProtector,UserControllers.getAll)
  .post(AuthControllers.routeProtector, UserControllers.create);

userRouter
  .route("/:id")
  .delete(AuthControllers.routeProtector, UserControllers.delete)
  .patch(AuthControllers.routeProtector, UserControllers.edit) 
  .get(AuthControllers.routeProtector, UserControllers.get)

module.exports = userRouter;
