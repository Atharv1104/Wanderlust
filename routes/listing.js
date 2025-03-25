const express = require('express');
const router = express.Router();
const wrapAsync=require("../Utils/wrapAsync.js");
const {reviewSchema}=require("../schema.js");
const ExpressError=require("../Utils/ExpressError.js")
const Listing= require("../Models/listing.js")
const flash=require("connect-flash");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js")



// index Route
router.get("/",
    wrapAsync(async (req,res)=>{
    
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings})
   }));

//New Route
router.get("/new",isLoggedIn,(req,res)=>{
    console.log(req.user);

    res.render("./listings/new.ejs");
});

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"review",
        populate:{
            path:"author"
        },
        })
        .populate("owner");
    if(!listing){
        req.flash("success","Listing does not Exist!");
        res.redirect("/listings")
    }
    res.render("./listings/show.ejs", { listing });
}));

//create
router.post("/",validateListing,isLoggedIn,
    wrapAsync(async(req,res,next)=>{
    
    const newListing=new Listing (req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","Listing Created!");
    res.redirect("/listings");
    
}));

//edit  
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("success","Listing does not Exist!");
        res.redirect("/listings")
    }
    req.flash("success","Successfully editd listing!");
    res.render("./listings/edit.ejs",{listing});
}));
//update
 router.put("/:id",validateListing,isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(!listing){
        req.flash("success","Listing does not Exist!");
        res.redirect("/listings")
    }
    req.flash("success"," Listing updated!");
    res.redirect(`/listings/${id}`);
 }
))

//Delete
router.delete("/:id/delete",isLoggedIn,isOwner,wrapAsync(
    async (req,res)=>{
        let {id}= req.params;
        const listing = await Listing.findById(id);
       let delListing= await Listing.findByIdAndDelete(id);
       
       req.flash("success","Listing deleted");
       if(!listing){
        req.flash("success","Listing does not Exist!");
        res.redirect("/listings")
        }
       
       res.redirect("/listings");
    })
);

module.exports=router;