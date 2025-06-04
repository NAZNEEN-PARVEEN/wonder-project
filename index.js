
 const express=require("express");
 const app=express();
 const  path=require("path"); 
const methodOverride = require("method-override");
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const { title } = require("process");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");




const mongo_url="mongodb://127.0.0.1:27017/wonderlust";
async function main() {
    await mongoose.connect(mongo_url);
}

  main().then(()=>{
    console.log("connection succesfull");
  }).catch((err)=>{
  console.log(err);
  });


app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);

/// its mam code 



app.get("/",(req,res)=>{
    console.log("i am root");
});

// app.get("/listing", async (req, res) => {
//     let sample = new Listing({
//         title: "My New Home",
//         description: "By the beach",
//         price: 1200,
//         location: "Chandigarh",
//         country: "India"  
//     });
//     await sample.save();
//     console.log("Sample saved");
//     res.send(" Successful testing");
// });


// index
app.get("/listing",wrapAsync( async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listing/index.ejs", { allListings });   
}));


//new
app.get("/listing/new",(req,res)=>{
    res.render("listing/new.ejs");
});

//show
app.get("/listing/:id",wrapAsync( async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listing/show.ejs",{listing});
}));



//middlewares
const validatelisting =(req,res,next)=>{
 let {error}= listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}





//create post
app.post("/listing",validatelisting,
     wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
}));


//edit
app.get("/listing/:id/edit" ,wrapAsync( async(req,res)=>{
 let {id}=req.params;
    const listing=await Listing.findById(id);
        
    res.render("listing/edit.ejs",{listing});
}));



// update route 
app.put("/listing/:id",validatelisting,
    wrapAsync( async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`);
}));


//delete
app.delete("/listing/:id" ,wrapAsync( async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
   
    res.redirect("/listing");
}));


app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("listing/error.ejs", { statusCode, message });
});




app.listen(3000,(req,res)=>{
    console.log("server is listening 3000");
});
