const express = require("express");
const AuthControllers = require("../controllers/authController");
const { routeProtector } = require("../middlewares/routeProtector");
const authRouter = express.Router();

authRouter.route("/login").post(AuthControllers.login);
authRouter.route("/register").post(AuthControllers.register);
authRouter.route("/email-verification").get(AuthControllers.activateEmail);
authRouter
  .route("/update-password")
  .patch(routeProtector, AuthControllers.updatePassword);

  authRouter
  .route("/send-new-email-code")
  .post(routeProtector, AuthControllers.sendNewEmailCode);
authRouter
  .route("/update-email")
  .post(routeProtector, AuthControllers.updateEmail);


  authRouter
  .route("/send-new-password-code")
  .post(  AuthControllers.sendNewPasswordCode);
authRouter
  .route("/update-password-with-code")
  .post(  AuthControllers.updatePasswordWithCode);

module.exports = authRouter;
