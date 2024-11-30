const { ref, required } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const  Review = require("./review.js") ;


const listingSchema = new Schema({
  title: String,
  description: String,
  image: String ,
  price: Number,
  location: String,
  country: String,
  reviews : [
    {
      type : Schema.Types.ObjectId ,
      ref :"Review" ,
    }
  ] ,
  owner : {
    type : Schema.Types.ObjectId ,
    ref : "User",
  }, 
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
