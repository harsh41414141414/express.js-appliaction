const Review = require('../models/review');
const Listing = require("../models/listing") ;
module.exports.createReiew = async (req, res) => {
    try {
        // Find the listing by ID
        const listing = await Listing.findById(req.params.id); // Use req.params.id

        if (!listing) {
            return res.status(404).send("Listing not found.");
        }

        // Create a new review
        const newReview = new Review(req.body.review);
        newReview.author = req.user._id ;
        // Save the review
        await newReview.save();
        req.flash("success","new review created") ;
      console.log(newReview) ;

        // Push the review's ObjectId into the listing's reviews array
        listing.reviews.push(newReview._id);

        // Save the listing
        await listing.save();

        console.log("New review saved");

        res.redirect(`/listings/${req.params.id}`); // Redirect to the listing page
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while saving the review.");
    }
}