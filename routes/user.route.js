const express = require("express");
const userRoute = express.Router();
const userController = require("../controllers/user.controller")


userRoute.route("/register").post(userController.register);
userRoute.route("/signin").post(userController.signin);

module.exports = {userRoute}