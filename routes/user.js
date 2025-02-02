const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middelware.js");
const userController = require("../controller/user.js");


router.get("/signup",userController.renderSignUpForm)

router.post("/signup",wrapAsync( userController.signUp));

router.get("/login",userController.renderLoginForm);

router.post("/login",saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect : "/login" ,
        failureFlash : true
    }),userController.logIn
    );

router.get("/logout",userController.logOut);

module.exports = router;
