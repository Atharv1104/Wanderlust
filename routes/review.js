const ExpressError=require("../Utils/ExpressError.js")
const wrapAsync=require("../Utils/wrapAsync.js")
const Review= require("../Models/review.js")
const express = require('express');
const router = express.Router({mergeParams:true});
const Listing= require("../Models/listing.js")

const {isLoggedIn,validateReview,isAuthor}=require("../middleware.js")




// reviews
// post review route
router.post("/", validateReview,isLoggedIn, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("New review saved");
    console.log(newReview);
    res.redirect(`/listings/${req.params.id}`);
}));

//delete review route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(async (req,res)=>{
    let {id, reviewId}=req.params;

    await Listing.findByIdAndUpdate(id, {pull: {review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    
    res.redirect(`/listings/${id}`);
}))

module.exports=router;