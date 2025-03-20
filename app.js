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
const session=require("express-session");

const flash=require("connect-flash");

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




const sessionOptions={
    secret: "mysupersecretestring", 
    resave:false, 
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*60*60*1000,
        maxAge:7 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.get("/",(req,res)=>{
    res.send("Hi i am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);


app.get("/admin", (req,res)=>{
    throw new ExpressError(403,"No Access to Admin")
});

app.all("*", (req,res)=>{
    throw new ExpressError(404,"Page Not Found")
});

app.use((err,req,res,next)=>{
    let {status=500 ,message="Some error occured"}= err;
    res.render("./error.ejs",{message});   
});
app.listen(8080,()=>{
    console.log("App is listening at port 8080");
});
