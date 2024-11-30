const { string, required } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose"); // it define username and
                                                                   // and passport by self so dont need to assign that 
const userSchema = new  Schema ({
     email :{
        type : String ,
        required : true 
     } ,

}) ;

userSchema.plugin(passportLocalMongoose) ;
module.exports = mongoose.model('User' ,userSchema) ;
