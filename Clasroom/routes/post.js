const express=require("express");
const router = express.Router();


//index
router.get("/",(req,res)=>{
    res.send("Welcome to post index")
});

//creat
router.get("/:id",(req,res)=>{
    res.send("Welcome to post ids")
});

//show
router.post("/",(req,res)=>{
    res.send("Welcome to post post")
});

//delete
router.delete("/:id",(req,res)=>{
    res.send("Welcome to post delete")
});

module.exports=router;