const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const Listing = require("./models/listing.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");



module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //we want user to go where he is stuck in login thats why we have created redirctUrl
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "log in to add listing");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body); //server side validation

if(error){
 throw new ExpressError(404,error);
}else{
 next()
}
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body); //server side validation

    if (error) {
        throw new ExpressError(404, error);
    } else {
        next()
    }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of the review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}