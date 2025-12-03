if( process.env.NODE_ENV != "production" ){
    require("dotenv").config();
}
// console.log(process.env);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// DB Connection
// const MONGO_URL = "mongodb://localhost:27017/Wanderlust";
const dbUrl = process.env.ATLASDB_URL || "mongodb://localhost:27017/Wanderlust";    


main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

// View engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//home route
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session
app.use(session({
  secret: "mysupersecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// LOCALS MIDDLEWARE - THIS MUST RUN BEFORE ROUTES
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  console.log("Locals set - currUser:", req.user ? req.user.username : "undefined");
  next();
});

// ROUTES - AFTER MIDDLEWARE
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// Error handling - BEFORE app.listen()
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message, err });
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});