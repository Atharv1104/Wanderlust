const express=require("express");

const router = express.Router();


//index
router.get("/",(req,res)=>{
    res.send("Welcome to user index");
});

//creat
router.get("/:id",(req,res)=>{
    res.send("Welcome to user new");
});

//show
router.post("/:id",(req,res)=>{
    res.send("Welcome to user id");
});

//delete
router.delete("/:id/delete",(req,res)=>{
    res.send("Welcome to user delete");
});

module.exports=router;