if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
}

const express =require("express");
const mongoose=require("mongoose");
const path=require("path")
const methodOverride=require("method-override");
const ejsMate= require("ejs-mate");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");

const ExpressError=require("./Utils/ExpressError.js");
const listingsRouter =require("./routes/listing.js");
const reviewsRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");
const User=require("./Models/user.js")

const app = express();
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl=process.env.ATLASDB_URL;

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
    // await mongoose.connect(dbUrl);
    await mongoose.connect(MONGO_URL);
}

// const store=MongoStore.create({
//     mongoUrl:dbUrl,
//     crypto:{
//         secret:process.env.SECRET,
//     },
//     touchAfter:24*60*60   
// });

// store.on("error",()=>{
//     console.log("Error on mongo session store",err);
// });
const sessionOptions={
    // store,
    secret: process.env.SECRET, 
    resave:false, 
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*60*60*1000,
        maxAge:7 * 60 * 60 * 1000,
        httpOnly: true,
    }
}



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
passport.use(new localStrategy(User.authenticate()));
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


// app.get("/demouser", async (req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

app.get("/admin", (req,res)=>{
    throw new ExpressError(403,"No Access to Admin")
});

app.all("*", (req,res)=>{
    throw new ExpressError(404,"Page Not Found")
});

app.use((err,req,res,next)=>{
    let {status=500 ,message="Some error occured"}= err;
    res.render("error.ejs",{message});   
});
app.listen(8080,()=>{
    console.log("App is listening at port 8080");
});
