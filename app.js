const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js"); 
const ExpressError = require("./utils/ExpressError.js"); 



let port = 8080;

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main()
.then(() => {
    console.log("connected to DB");
})
.catch( ( err ) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine" ,"ejs");
app.set("views" , path.join(__dirname , "views") );
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride('_method')); 
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/" , ( req , res ) =>{
    res.send("hii , im rooooot ");
})

//index route 
app.get("/listings" ,  wrapAsync (async ( req , res ) => {
    const allListings = await Listing.find({});
    // render expects the view name relative to the `views` directory, without leading slash or extension
    res.render("listings/index.ejs" , { allListings });
}));

//new route 
app.get("/listings/new" , ( req , res ) => {
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id" ,wrapAsync( async ( req , res ) => {
    let {id } = req.params;
    const listing = await Listing.findById(id); 
    res.render("listings/show.ejs" , {listing});
}));

app.post("/listings" , wrapAsync (async  ( req , res , next ) => {
    if ( !req.body.listing ) {
        throw new ExpressError(400, "Invalid Listing Data");
    }
      const newlisting = new Listing(req.body.listing) ;
        await newlisting.save();
    // console.log(listing);
       res.redirect("/listings");
    }
    )
    
);

// edit route
app.get("/listings/:id/edit" , wrapAsync (async ( req , res ) =>{
    let {id } = req.params;
    const listing = await Listing.findById(id); 
     console.log("Listing data:", listing);
    console.log("Image data:", listing.image);
    res.render("listings/edit.ejs" , {listing});
}));




// update route
app.put("/listings/:id" , wrapAsync (async ( req , res ) =>{
    if ( !req.body.listing ) {
        throw new ExpressError(400, "Invalid Listing Data");
    }
    let {id } = req.params;
     await Listing.findByIdAndUpdate(id , {...req.body.listing});
     res.redirect(`/listings/${id}`); 

}));

// delete route
app.delete("/listings/:id" , wrapAsync (async ( req , res ) =>{
    let {id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted Listing:", deletedListing);

     res.redirect("/listings");
    }));



// app.get("/testlisting" , async ( req , res ) =>{
//     let sampleListings = new Listing( {
//         title : "MY New Home",
//         description : "By the Beach",
//         price : 1200,
//         location : "Indore",
//         country : "India",
//     });

//     await sampleListings.save();
//     console.log(" sample was saved");
//     res.send("successful testing");
    
// });

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use(( err , req , res , next ) =>{
let {statusCode = 500 , message = "Something went wrong!" } = err ;
// res.status(statusCode).send( message );
res.status(statusCode).render("error.ejs" , { message });
    
});

app.listen(port , () =>{
    console.log(` port is listening at ${port}`);

} )