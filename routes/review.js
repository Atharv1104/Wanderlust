const wrapAsync=require("../Utils/wrapAsync.js");
const express = require('express');
const router = express.Router({mergeParams:true});
const {isLoggedIn,validateReview,isAuthor}=require("../middleware.js");
const reviewController=require("../Controllers/review.js");



// reviews
// post review route
router.post("/",
    validateReview,
    isLoggedIn,
    wrapAsync(reviewController.postReview));

//delete review route
router.delete("/:reviewId",
    isLoggedIn,
    isAuthor,
    wrapAsync(reviewController.deleteReview));

module.exports=router;