const express = require("express");
const router = express.Router(); // Initialize router
const listingController = require("../controllers/listing");
const { isLoggedIn, isOwner } = require("../middleware");
const multer = require('multer');
const path = require('path');
const { storage} = require("../cloudConfig.js") ; 
 // For handling form-data
 //const storage = multer.diskStorage({
//  destination: function (req, file, cb) {
 //   cb(null, 'uploads/');  // Make sure the 'uploads' directory exists
 // },
 // filename: function (req, file, cb) {
 //   cb(null, Date.now() + path.extname(file.originalname));  // Unique file names
 // } 
//});

const upload = multer({ storage });

router.post('/listings', upload.single('file'), listingController.createListing);




router.get("/", listingController.index);

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
  .get(listingController.showListing)
  .put(isLoggedIn, isOwner, listingController.updateListing)
  .delete(isLoggedIn, isOwner, listingController.destroyListing);

router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);

module.exports = router;
