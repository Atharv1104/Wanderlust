const Listing= require("../Models/listing.js");
const Review=require("../Models/review.js");

module.exports.postReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("New review saved");
    console.log(newReview);
    res.redirect(`/listings/${req.params.id}`);
};
module.exports.deleteReview=async (req,res)=>{
    let {id, reviewId}=req.params;

    await Listing.findByIdAndUpdate(id, {pull: {review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    
    res.redirect(`/listings/${id}`);
};