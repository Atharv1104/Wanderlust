const Listing= require("../Models/listing.js")



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

module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing (req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","Listing Created!");
    res.redirect("/listings");
    
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