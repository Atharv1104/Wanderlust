
const express=require("express");
const app= express();
const posts  = require("./routes/post.js");
const users = require("./routes/user.js");
const cookieParser = require("cookie-parser");
const session =require("express-session");
const flash=require("connect-flash")
const path=require("path")


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOptions={
    secret: "mysupersecretestring", 
    resave:false, 
    saveUninitialized:true
}

app.use(session(sessionOptions));
app.use(cookieParser("secretcode"));
app.use(flash());



app.get("/register", (req,res)=>{
    let {name="Guest"}=req.query;
    req.session.name=name;
    (name=="Guest")?
    req.flash("error", "user not registered "):
    req.flash("success", "user registered successfully");
    res.redirect("/hello");
});

app.get("/hello", (req,res)=>{
    res.locals.successMsg= req.flash("Success");
    res.locals.errorMsg= req.flash("error");
    res.render("page.ejs",{name:req.session.name});
})

// app.get("/getcookies",(req,res)=>{
//     res.cookie("name","Atharv",);
//     res.send("Sent you some cookies");
// })
// app.get("/getsignedcookies",(req,res)=>{
//     res.cookie("name","shiv",{signed: true});
//     res.send("Sent you some cookies");
// })
// app.get("/",(req,res)=>{
//     let{name="Anonymus"}=req.cookies;
//     res.send(`Hello ${name}`);
// })
// app.use("/posts",posts);
// app.get("/verify",(req,res)=>{
    
//     res.send(req.signedCookies);
// })
// app.use("/posts",posts);
// app.use("/users",users);

app.listen(3000,()=>{
    console.log("App is listening at port 3000");
});

