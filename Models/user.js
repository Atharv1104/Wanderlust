
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema= new Schema({
    email:{
        type:String,
        required:true,
    }
});
//username and password are defined automatically by passport Local Mongoose

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model('User',userSchema);