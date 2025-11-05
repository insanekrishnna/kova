const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js"); 


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");



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


app.use("/listings", listings );
app.use("/listings/:id/reviews", reviews );


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