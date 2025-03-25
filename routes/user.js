const express = require('express');
const router = express.Router();
const User=require("../Models/user.js");
const wrapAsync = require('../Utils/wrapAsync');
const passport=require("passport");
const { savedRedirectUrl } = require('../middleware.js');

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res,next)=>{
    
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email, username});
        let registeredUser=await User.register(newUser,password)
        req.login(registeredUser,(err)=>{
            if(err){
              return next(err)
             }   
            req.flash("success", "User  registered successfully");
            res.redirect("/listings");
         });
    }catch(er){
        req.flash("error",er.message)
        res.redirect("/signup")
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})
router.post("/login",
    savedRedirectUrl,
    passport.authenticate(
    "local",
    {failureRedirect:'/login',
    failureFlash:true}),
    (req,res)=>{
        req.flash("success","welcome back to wanderlust!");
        let redirectUrl=res.locals.redirectUrl||"/listings"
        res.redirect(redirectUrl);
});
router.get('/logout',(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
        return next(err);
    }
       req.flash("success","Logged out successfully!");
    res.redirect("/listings")
    });
    
});

module.exports=router;