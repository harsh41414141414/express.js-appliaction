const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema.js"); // Add this for schema validation



// Ensure your controllers are wrapped with try-catch for error handling

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs"); 
};

module.exports.createListing = async (req, res, next) => {
  try {
    // Check if req.body.listing exists
    if (!req.body.listing) {
      console.error("Listing data is missing in the request body");
      req.flash("error", "Listing data is missing. Please fill out the form correctly.");
      return res.status(400).send("Missing listing data in request body");
    }

    // Create a new listing instance with the form data
    const newListing = new Listing({
      title: req.body.listing.title,
      description: req.body.listing.description,
      image: req.body.listing.image,
      price: req.body.listing.price,
      country: req.body.listing.country,
      location: req.body.listing.location
    });

    // Save the listing to the database
    await newListing.save();

    console.log("New listing created:", newListing);
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");  // Redirect after successful save
  } catch (err) {
    console.error("Error processing the form:", err);
    req.flash("error", "An error occurred while processing the form.");
    res.status(500).send("An error occurred while processing the form");
  }
};



// module.exports.createListing = async (req, res, next) => {

//   const newListing = new Listing (req.body.listing);
//   newListing.owner = req.user._id ; 
//   await newListing.save() ;
//   req.flash("success", "New Listing Created!") ;
//   res.redirect("/listings") ;
// } ;


module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id) ;

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body });
  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};
