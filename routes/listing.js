const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middelware.js");
const listingController = require("../controller/listings.js");
const multer  = require('multer');//for managing files like png pdf
const {storage}= require("../cloudConfig.js");
const upload = multer({ storage });
router
    .route("/")
    .get(wrapAsync(listingController.index))//index route
    .post(isLoggedIn,
       upload.single('listing[image]'), validateListing/*working as middleware*/
       ,
         wrapAsync(listingController.creatListings));//create route
 

// new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListings))//show route
    .put(isOwner, isLoggedIn,
        upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListings))//update route
    .delete(isOwner, isLoggedIn, wrapAsync(listingController.deleteListings));//delete route



//edite route
router.get("/:id/edit", isOwner, isLoggedIn, wrapAsync(listingController.renderEditListingsForm));





module.exports = router;