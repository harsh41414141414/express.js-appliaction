const mongoose = require("mongoose");
const initData = require("./data.js")
const path = require('path');

// Use path.join to construct the path dynamically
const listingPath = path.join(__dirname, '../models/listing.js');
const Listing = require(listingPath);  // Dynamically require the model

main().then(() => {
    console.log("connection successful");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/chatsbox');
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner : "66fea589d23349d0e4d5f24f"})) ; 

    
    await Listing.insertMany(initData.data);
   // console.log(  await    Listing.insertMany(initData.data)  ); 
    console.log("data was initialized");
};

initDB();
