const Listing= require("../Models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;

// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//index
module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings})
};

//new

module.exports.newForm=(req,res)=>{
    res.render("./listings/new.ejs")
};

//show

module.exports.showListing=async (req, res) => {
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
};

//creat

module.exports.createListing = async (req, res, next) => {
    try {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;

        // Check if an image was uploaded
        if (req.file) {
            const url = req.file.path;
            const filename = req.file.filename;
            newListing.image = { url, filename };
        } else {
            // Set a default image if no image is uploaded
            newListing.image = {
                url: 'https://via.placeholder.com/300', // Replace with your default image URL
                filename: 'default-image',
            };
        }

        await newListing.save();
        req.flash('success', 'Listing Created!');
        res.redirect('/listings');
    } catch (err) {
        next(err);
    }
};

//edit

module.exports.editForm=async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("success","Listing does not Exist!");
        res.redirect("/listings")
    }
    req.flash("success","Successfully editd listing!");
    res.render("./listings/edit.ejs",{listing});
};

//update

module.exports.updateListing=async(req,res)=>{
   
    let {id}= req.params;
    const listing = await Listing.findById(id);
    const updatedListing=await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    updatedListing.image={url,filename};
    await updatedListing.save();
    }
    if(!listing){
        req.flash("success","Listing does not Exist!");
        res.redirect("/listings")
    }
    req.flash("success"," Listing updated!");
    res.redirect(`/listings/${id}`);
};

//delete

module.exports.deleteListing=async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
   let delListing= await Listing.findByIdAndDelete(id);
   
   req.flash("success","Listing deleted");
   if(!listing){
    req.flash("success","Listing does not Exist!");
    res.redirect("/listings")
    }
   
   res.redirect("/listings");
};
module.exports.searchListing=async(req,res)=>{
    let {search}=req.query;
   
    const listings = await Listing.find({ location: { $regex: search, $options: 'i' } });
    if(listings.length==0){
        req.flash("error","No results found!");
        res.redirect("/listings")
    }else{
        res.render("./listings/search.ejs",{ allListings: listings, search });
    }
    
};
module.exports.categoriesListing=async(req,res)=>{
    let {filter}=req.query;
    
    const listings = await Listing.find({ category: { $regex: filter, $options: 'i' } });
    
    if(listings.length==0){
        req.flash("error","No results found!");
        res.redirect("/listings")
    }else{
        res.render("./listings/filters.ejs",{ allListings: listings, filter});
    }
    
};
