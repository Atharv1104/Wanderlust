const express =require("express");
const app = express();
const listings =require("./routes/listing.js")
const mongoose=require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const path=require("path")
const methodOverride=require("method-override");
const ejsMate= require("ejs-mate");
const ExpressError=require("./Utils/ExpressError.js")
const reviews= require("./routes/review.js")

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





app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews)


app.get("/admin", (req,res)=>{
    throw new ExpressError(403,"No Access to Admin")
})

app.use((err,req,res,next)=>{
    let {status=500 ,message="Some error occured"}= err;
    res.render("./error.ejs",{message});   
})
app.listen(8080,()=>{
    console.log("App is listening at port 8080");
});
