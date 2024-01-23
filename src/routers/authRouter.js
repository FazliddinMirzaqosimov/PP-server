



const express = require("express");
 const AuthControllers =require("../controllers/authController")
const authRouter = express.Router();

authRouter.route("/login").post(AuthControllers.login);
authRouter.route("/register").post(AuthControllers.register );
 
// authRouter
//   .route("/")
//   .get(routeProtector, getAllAdmins)
//   .post(routeProtector, createAdmin);
// authRouter
//   .route("/:id")
//   .get(routeProtector, getAdmin)
//   .delete(routeProtector, deleteAdmin)
//   .patch(routeProtector, editAdmin);

module.exports = authRouter;