if(process.env.Node_ENV != "production"){
  require('dotenv').config() ;
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const listingPath = path.join(__dirname, 'models/listing.js'); //
const Listing = require(listingPath); //
const  methodOverride = require("method-override") ;
const ejsMate = require("ejs-mate");
const WrapAsync = require('./utils/wrapAsync.js'); //
const ExpressError = require("./utils/ExpressError.js") ; 
const Review = require('./models/review'); // Ensure the path is correc t //
const { reviewSchema } = require("./schema.js") ; //
const session = require("express-session") ;
const  flash = require("connect-flash");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter =require("./routes/review.js"); 
const userRouter =require("./routes/user.js"); 
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js") ;
const { register } = require("module");
const multer = require('multer');
const { storage} = require("./cloudConfig.js");
const upload = multer({ storage }); // This line seems fine, but...


main().then(() => { 
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/chatsbox');
}
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errorMsg = error.details.map((el) => el.message).join(', ');
    throw new ExpressError(400, errorMsg); // Corrected typo in variable name from errMsg to errorMsg
  } else {
    next();
  }
};


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method")) ;
app.engine('ejs' , ejsMate ) ;
app.use(express.static(path.join(__dirname , "/public"))) ;
app.use(express.static('public'));
app.use(upload.none()); 

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true, 
  cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true
  }
}; 
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.get("/", (req, res) => {
  res.send("This is on going project");
});

app.use( flash()) ;
app.use( (req,res,next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user ; 
 // Fixed the undefined variable issue
  next() ;
})  




app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews" , reviewsRouter)  ;
app.use("/" , userRouter) ;



// Start server
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
