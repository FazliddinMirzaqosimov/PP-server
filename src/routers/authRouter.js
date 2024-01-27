



const express = require("express");
 const AuthControllers =require("../controllers/authController")
const authRouter = express.Router();

authRouter.route("/login").post(AuthControllers.login);
authRouter.route("/register").post(AuthControllers.register );
authRouter.route("/email-verification").get(AuthControllers.activateEmail );


module.exports = authRouter;