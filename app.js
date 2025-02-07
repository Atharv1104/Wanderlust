
const express =require("express");
const app = express();
const mongoose=require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const path=require("path")
const methodOverride=require("method-override");
const ejsMate= require("ejs-mate");
const Listing= require("./Models/listing.js")
const ExpressError=require("./Utils/ExpressError.js")
const wrapAsync=require("./Utils/wrapAsync.js")
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")))



main()
.then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}


app.get("/",(req,res)=>{
    res.send("Hi i am root");
});

// index Route
app.get("/listings",
    wrapAsync(async (req,res)=>{
    
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings})
   }));

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
    })

//Read Route
app.get("/listing/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
}));

//create
app.post("/listings",
    wrapAsync(async(req,res,next)=>{
    
    const newListing=new Listing (req.body.listing);
    await newListing.save();
    res.redirect("/listings")
    
    

}));
    
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}));
//update
 app.put("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}/edit`);
 }
))

//Delete
app.delete("/listings/:id/delete",wrapAsync(
    async (req,res)=>{
        let {id}= req.params;
       let delListing= await Listing.findByIdAndDelete(id);
       console.log(delListing);
       res.redirect("/listings");
    })
);


app.get("/admin", (req,res)=>{
    throw new ExpressError(403,"No Access to Admin")
})

app.use((err,req,res,next)=>{
    let {status=500 ,message="Some error occured"}= err;
    res.status(status).send(message);   
})
app.listen(8080,()=>{
    console.log("App is listening at port 8080");
});
