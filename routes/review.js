const express = require("express");
const router = express.Router({ mergeParams: true }); // Use mergeParams to get :id from parent route
const WrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require("../utils/ExpressError.js"); 
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require('../models/review'); // Ensure the path is correct
const {isLoggedIn, isOwner} = require("../middleware.js")
const reviewController =  require( "../controllers/reviews.js");

router.post("/",isLoggedIn , reviewController.createReiew);

module.exports = router;
