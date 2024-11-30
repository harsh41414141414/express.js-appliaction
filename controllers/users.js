const User = require("../models/user") ;
module.exports.renderSignUpForm = (req ,res) =>{
    res.render("users/login.ejs");
}


module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        // Creating a new user instance with email and username
        const newUser = new User({ email, username });

        // Registering the user with the provided password
        const registeredUser = await User.register(newUser, password);

        // Logging in the registered user
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);  // Pass the error to the next middleware
            }
            console.log("Registered User: ", registeredUser);
            // Flash message to indicate successful registration
            req.flash("success", "Welcome to WanderLust");
            // Redirecting to the listing page after successful signup
            res.redirect("/listings");
        });
    } catch (err) {
        if (err.name === "UserExistsError") {
            req.flash("error", "A user with that username already exists. Please choose a different username.");
            return res.redirect("/signup");
        }

        console.error(err);
        req.flash("error", "An error occurred while registering the user. Please try again.");
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = async( req, res) =>{ 
    req.flash( "success" ,"welcome  back to WunderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

module.exports.Logout = (req ,res , next) =>{
    req.logout((err) =>{
          if(err){
           return  next(err); 
          }
          req.flash("success" , "you are logged out!"); 
          res.redirect("/listings"); 
    })
}