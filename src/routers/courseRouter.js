const express = require("express");
const UserControllers = require("../controllers/userController");
const AuthControllers = require("../controllers/authController");

const courseRouter = express.Router();

courseRouter
  .route("/")
  .get(AuthControllers.routeProtector,UserControllers.getAll)
  .post(AuthControllers.routeProtector, UserControllers.create);

courseRouter
  .route("/:id")
  .delete(AuthControllers.routeProtector, UserControllers.delete)
  .patch(AuthControllers.routeProtector, UserControllers.edit) 
  .get(AuthControllers.routeProtector, UserControllers.get)

module.exports = courseRouter;
