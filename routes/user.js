const express = require('express');
const router = express.Router();
const wrapAsync = require('../Utils/wrapAsync');
const passport=require("passport");
const { savedRedirectUrl } = require('../middleware.js');
const userController=require("../Controllers/users.js");


router.route("/signup")
.get(userController.renderSignup)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLogin)
.post(savedRedirectUrl,
    passport.authenticate(
    "local",
    {failureRedirect:'/login',
    failureFlash:true}),
    userController.login);

router.get('/logout',userController.logout);

module.exports=router;