const express = require('express');
const router = express.Router();
const User=require("../Models/user.js");
const wrapAsync = require('../Utils/wrapAsync');
const passport=require("passport");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res)=>{
    try{
        let{username,email,password}=req.body;
    const newUser=new User({email, username});
    let user=await User.register(newUser,password)
    req.flash("success", "user  registered successfully");
    res.redirect("/listings")
    }catch(er){
        req.flash("error",er.message)
        res.redirect("/signup")
    }
    
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})
router.post("/login",
    passport.authenticate(
    "local",
    {failureRedirect:'/login',
    failureFlash:true}),
    wrapAsync(async(req,res)=>{
        req.flash("success","welcome back to wanderlust!");
        res.redirect("/listings");
}))

module.exports=router;