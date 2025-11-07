const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true, 
    },
    description: String,
    image: {
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157" : v
        },
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
});

listingSchema.post("findOneAndDelete", async (listing)=>{
    if( listing ) {
        await Review.deleteMany({ _id : { $in : listing.reviews } });
    }

})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
