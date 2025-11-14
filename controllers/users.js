const User = require("../models/user.js"); 

module.exports.renderSignupForm = ( req , res ) => {
    res.render("userS/signup.ejs");
};

module.exports.signup = async ( req , res ) => {
    try{
        let { username , email , password } = req.body;
     const newUser = new User({ email , username });
     const registeredUser = await User.register( newUser , password  );
     console.log( registeredUser );
     req.login(registeredUser, (err) => {
         if (err) {
             req.flash("error", "Something went wrong!");
             return next(err);
         }
         req.flash("success", "Welcome to KOVA !" );
         res.redirect("/listings");
     });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
    
};

module.exports.renderLoginForm =  ( req , res ) => {
    res.render("users/login.ejs");
}

module.exports.login = async ( req , res ) => {
    req.flash("success", "Welcome back to Kovaa " );
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = ( req , res ) => {
    req.logout( ( err ) => {
        if ( err ) {
            req.flash("error", "Something went wrong!");
            // return res.redirect("/listings");
            return next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/login");
    });
};