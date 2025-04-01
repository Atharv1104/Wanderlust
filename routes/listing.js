const express = require('express');
const router = express.Router();
const wrapAsync=require("../Utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js")
const listingController=require("../Controllers/listings.js")
const multer  = require('multer')
const{storage}=require("../cloudConfig.js")
const upload = multer({ storage });


router.route("/")
.get(
    wrapAsync(listingController.index))

.post(
    isLoggedIn,
    // validateListing,
    upload.single('listing[image]'),
    wrapAsync(listingController.createListing));

//New Route
router.get("/search",wrapAsync(listingController.searchListing))
router.get("/category",wrapAsync(listingController.categoriesListing))

router.get("/new",
    isLoggedIn,
    listingController.newForm);


router.route("/:id")
.get(
    wrapAsync(listingController.showListing))
.put(
    
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    // validateListing,
    wrapAsync(listingController.updateListing));
    





// Show Route




//edit  

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editForm));

//update

//Delete

router.delete("/:id/delete",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
);


module.exports=router;