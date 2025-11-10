const Listing = require("../models/listing");


module.exports.index = async ( req , res ) => {
    const allListings = await Listing.find({});
    // render expects the view name relative to the `views` directory, without leading slash or extension
    res.render("listings/index.ejs" , { allListings });
}

module.exports.renderNewForm = ( req , res ) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path : "reviews", populate: { path: "author", }, }).populate("owner")    ;
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");  // Add return here
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};
     
module.exports.createListing = (async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully added a new listing !");
    res.redirect("/listings");
});

module.exports.renderEditForm = async ( req , res ) =>{
    let {id } = req.params;
    const listing = await Listing.findById(id); 

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");  // Add return here
    }
    res.render("listings/edit.ejs" , {listing});
};

module.exports.updateListing = async ( req , res ) =>{
    let {id } = req.params;


     await Listing.findByIdAndUpdate(id , {...req.body.listing});
        req.flash("success", "Yupp, Listing Updated !");
     res.redirect(`/listings/${id}`); 

};

module.exports.destroyListing = async ( req , res ) =>{
    let {id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted Listing:", deletedListing);
    req.flash("success", "Listing deleted !");
     res.redirect("/listings");
    };