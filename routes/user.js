const express = require("express");
const router = express.Router();
//const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController =  require( "../controllers/users.js");


router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", userController.signup) ;

router.get( "/login" , userController.renderSignUpForm ) ;

router.post("/login" , saveRedirectUrl ,passport.authenticate("local" ,{
    failureRedirect : "/login",
    failureFlash : true ,
}) 
, userController.renderLoginForm) ;


router.get("/logout" , userController.Logout) ;

module.exports = router;
