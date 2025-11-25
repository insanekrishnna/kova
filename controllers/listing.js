const Listing = require("../models/listing.js");


module.exports.index = async ( req , res ) => {
    const allListings = await Listing.find({});
    // render expects the view name relative to the `views` directory, without leading slash or extension
    res.render("listings/index.ejs" , { allListings });
}

module.exports.renderNewForm = ( req , res ) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author", select: "username" } // <-- populate review.author
    })
    .populate("owner", "username");
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
};
     
module.exports.createListing = (async (req, res) => {
   let url = req.file.path;
   let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url , filename };
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
});

module.exports.renderEditForm = async ( req , res ) =>{
    let {id } = req.params;
    const listing = await Listing.findById(id); 
    
    if ( typeof req.file !== 'undefined' ) {
    let url = req.file.path;
   let filename = req.file.filename;

   listing.image = { url , filename };
    await listing.save();
    }
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");  // Add return here
    }
    res.render("listings/edit.ejs" , {listing});
};

module.exports.updateListing = async ( req , res ) =>{
    let {id } = req.params;


     await Listing.findByIdAndUpdate(id , {...req.body.listing});
        req.flash("success", "Listing Updated!");
     res.redirect(`/listings/${id}`); 

};

module.exports.destroyListing = async ( req , res ) =>{
    let {id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
     res.redirect("/listings");
    };