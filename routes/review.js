const ExpressError=require("../Utils/ExpressError.js")
const wrapAsync=require("../Utils/wrapAsync.js")
const {listingSchema,reviewSchema}=require("../schema.js");
const Review= require("../Models/review.js")
const express = require('express');
const router = express.Router({mergeParams:true});
const Listing= require("../Models/listing.js")


const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body.Review);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400,errMsg);
        
    }else{
        next();
    }
    
    
};

// reviews
// post review route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    await newReview.save(); // Save the review first
    listing.review.push(newReview);
    await listing.save();
    console.log("New review saved");
    console.log(newReview);
    res.redirect(`/listings/${req.params.id}`);
}));

//delete review route
router.delete("/:reviewId",wrapAsync(async (req,res)=>{
    let {id, reviewId}=req.params;

    await Listing.findByIdAndUpdate(id, {pull: {review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    
    res.redirect(`/listings/${id}`);
}))

module.exports=router;