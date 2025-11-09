const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signup" , ( req , res ) => {
    res.render("userS/signup.ejs");
});

router.post("/signup" , wrapAsync( async ( req , res ) => {
    try{
        let { username , email , password } = req.body;
     const newUser = new User({ email , username });
     const registeredUser = await User.register( newUser , password  );
     console.log( registeredUser );
        req.flash("success", "Welcome to KOVA !" );
        res.redirect("/listings");
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
    
}));

router.get("/login" , ( req , res ) => {
    res.render("users/login.ejs");
});

router.post("/login" ,passport.authenticate("local" , { failureFlash: true , failureRedirect: "/login" }) , wrapAsync( async ( req , res ) => {
    req.flash("success", "Welcome back to Kovaa " );
    res.redirect("/listings");
}));

module.exports = router;