const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken });
const {cloudinary}= require("../cloudConfig.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs");

};


module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

   if(listing.geometry.coordinates.length==0){
    let response= await geocodingClient.forwardGeocode({
        query: listing.location,
        limit: 1
      })
        .send()
 

    listing.geometry =response.body.features[0].geometry;

   await listing.save()

   }
   listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author", }, }).populate("owner");
    if (!listing) {
        req.flash("error", "listing you are searching is not present");
        res.redirect("/listings");


    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.creatListings = async (req, res, next) => {
   let response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
 

    
    // we have create obj of listing in the form of new.ejs

    //    let result = listingSchema.validate(req.body); //server side validation
    //  console.log(result);
    //  if(result.error){
    //     throw new ExpressError(404,result.error);
    //  }   we can make function of it

    let url = req.file.path;
    let filename = req.file.filename;

    let newListing = Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url , filename};
    newListing.geometry =response.body.features[0].geometry;
    req.flash("success", "new listing created successfully");
   let nL= await newListing.save();
   console.log(nL);
    res.redirect("/listings");


};

module.exports.renderEditListingsForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "listing you are searching is not present");
        res.redirect("/listings");


    }

    let originalImageListing = listing.image.url;
    originalImageListing = originalImageListing.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing,originalImageListing });
};

module.exports.updateListings = async (req, res) => {
    let response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()

    let { id } = req.params;
    let l = await Listing.findById(id);
  
    let newListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!= "undefined"){
        
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = {url , filename};
    newListing.geometry =response.body.features[0].geometry;

 await newListing.save();

    }
    if(l.image.filename!="listingimage"){
        cloudinary.uploader
      .destroy(`${l.image.filename}`)
      .then(result => console.log(result));
        }
    req.flash("success", "listing updated successfully");

    res.redirect("/listings");
};

module.exports.deleteListings = async (req, res) => {
    let { id } = req.params;
    let l = await Listing.findById(id);
    console.log(await Listing.findByIdAndDelete(id));
    if(l.image.filename!="listingimage"){
    cloudinary.uploader
  .destroy(`${l.image.filename}`)
  .then(result => console.log(result));
    }
    req.flash("success", "listing deleted successfully");

    res.redirect("/listings");
}