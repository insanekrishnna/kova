const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn  , isreviewAuthor} = require("../middlewear.js");
const reviewController = require("../controllers/reviews.js");

// Review Routes
router.post('/', isLoggedIn, validateReview, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listings');
  }
  const review = new Review(req.body.review);
  review.author = req.user._id; // <-- set the author before saving
  await review.save();
  listing.reviews.push(review);
  await listing.save();
  req.flash('success', 'Review added');
  res.redirect(`/listings/${listing._id}`);
}));

    // delete review route
    router.delete("/:reviewId", isLoggedIn, isreviewAuthor, wrapAsync( reviewController.destroyReview ));

module.exports = router;