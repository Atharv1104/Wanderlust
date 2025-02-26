const express = require('express');
const router = express.Router();
const wrapAsync=require("../Utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../Utils/ExpressError.js")
const Listing= require("../Models/listing.js")


const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// index Route
router.get("/",
    wrapAsync(async (req,res)=>{
    
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings})
   }));

//New Route
router.get("/new",(req,res)=>{
    res.render("./listings/new.ejs");
    })

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("review");
    res.render("./listings/show.ejs", { listing });
}));

//create
router.post("/",validateListing,
    wrapAsync(async(req,res,next)=>{
    
    const newListing=new Listing (req.body.listing);
    await newListing.save();
    res.redirect("/listings")
}));

//edit  
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}));
//update
 router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}/edit`);
 }
))

//Delete
router.delete("/:id/delete",wrapAsync(
    async (req,res)=>{
        let {id}= req.params;
       let delListing= await Listing.findByIdAndDelete(id);
       console.log(delListing);
       res.redirect("/listings");
    })
);

module.exports=router;