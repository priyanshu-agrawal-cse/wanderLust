const express = require("express");
const router = express.Router({ mergeParams: true });// here we have done mergeParams trure as we want the id of parent (listing) should also go to the review route as with that id only we can find the listing to add review object in it 
const wrapAsync = require("../utils/wrapAsync.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middelware.js");
const reviewController = require("../controller/review.js");









//Review 
//review post 

router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//review delete

router.delete("/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;