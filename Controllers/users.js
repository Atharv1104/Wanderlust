const User=require("../Models/user.js");

module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.signup=async(req,res,next)=>{
    
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
        res.redirect("/signup",)
    }
};
module.exports.renderLogin=(req,res)=>{
    
    res.render("users/login.ejs",);
};
module.exports.login=(req,res)=>{
    req.flash("success","welcome back to wanderlust!");
    let redirectUrl=res.locals.redirectUrl||"/listings"
    res.redirect(redirectUrl);
};
module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
        return next(err);
    }
       req.flash("success","Logged out successfully!");
    res.redirect("/listings")
    });
    
};