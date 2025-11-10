const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewear.js");

router.get("/signup" , ( req , res ) => {
    res.render("userS/signup.ejs");
});

router.post("/signup" , wrapAsync( async ( req , res ) => {
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
    
}));

router.get("/login"  , ( req , res ) => {
    res.render("users/login.ejs");
});

router.post("/login" ,saveRedirectUrl,passport.authenticate("local" , { failureFlash: true , failureRedirect: "/login" }) , wrapAsync( async ( req , res ) => {
    req.flash("success", "Welcome back to Kovaa " );
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}));

router.get("/logout" , ( req , res ) => {
    req.logout( ( err ) => {
        if ( err ) {
            req.flash("error", "Something went wrong!");
            // return res.redirect("/listings");
            return next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/login");
    });
});

module.exports = router;