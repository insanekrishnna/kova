const mongoose = require('mongoose');
const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash('error', 'Invalid listing id');
            return res.redirect('/listings');
        }

        const listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: { path: "author", select: "username" }
            })
            .populate("owner");

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        res.render("listings/show.ejs", { listing });
    } catch (err) {
        next(err);
    }
};

module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    
    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    
    const updateData = { ...req.body.listing };
    
    if (req.file) {
        updateData.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    
    await Listing.findByIdAndUpdate(id, updateData, { new: true });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

module.exports.filterListings = async (req, res) => {
    const filters = {};
    
    if (req.query.category && req.query.category !== '') {
        filters.category = req.query.category;
    }
    
    if (req.query.location && req.query.location !== '') {
        filters.location = new RegExp(req.query.location, 'i');
    }
    
    const listings = await Listing.find(filters);
    res.json(listings);
};

module.exports.searchListings = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query || query.trim() === '') {
            req.flash("error", "Please enter a search query");
            return res.redirect("/listings");
        }

        // Search in title, description, location, category
        const searchResults = await Listing.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { location: { $regex: query, $options: 'i' } },
                { country: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        }).populate("owner");

        if (searchResults.length === 0) {
            req.flash("error", `No listings found for "${query}"`);
            return res.redirect("/listings");
        }

        res.render("listings/search.ejs", { 
            allListings: searchResults, 
            query: query 
        });
    } catch (err) {
        req.flash("error", "An error occurred during search");
        res.redirect("/listings");
    }
};