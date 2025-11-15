require('dotenv').config()//this is a secret file used in devlopment not in production
//console.log(process.env.SECRET) // remove this after you've confirmed it is working
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');//for using session on production
const flash = require("connect-flash");//to flash message
const passport = require("passport");//authorijation
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const db_url = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(db_url);
};

main()
.then((res)=>{
    console.log("connection to database is stablished")
})
.catch(err => console.log(err));



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname ,"/public")));

const store = MongoStore.create({
  mongoUrl: db_url,
  crypto: {
    secret: process.env.SECRECT ,
  },
  touchAfter: 24*3600 ,
})

store.on("error",(err) =>{
  console.log("error in mongo session store ", err)
})

let sessionOption ={
  store,
    secret: process.env.SECRECT ,
    resave: false,
  saveUninitialized: true,
  Cookie: {
    expires: Date.now() + 7*24*60*60*1000,
    maxAge : 7*24*60*60*1000,
    httpOnly : true,

  },

  };



app.get("/",(req,res)=>{
    res.redirect("/listings");
});
app.use(session(sessionOption));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/register",async(req,res)=>{
//     let fakeUser = new User({
//         email: "123@gmail.com",
//         username : "hello",
//     });
//     let ru = await User.register(fakeUser,"myPass");
//     console.log(ru);
//     res.send(ru);
// });



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



 
// app.get("/listingTesting",async (req,res)=>{
//     let newListing = new Listing({
//         titel: " my ne wvila",
//         description : " welcome backe ",
//         price : 77,
//         location : " obra ",
//         country : "india ",
//     })

//     await newListing.save();
//     console.log(" data saved ");
//     res.send(" working properly");
// })






app.get("/",(req,res)=>{
  res.redirect("/listings");
})

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})

app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong" }= err;

    // res.send("something went wrong");
    // 
    // res.status(status).send(message);
    res.render("listings/error.ejs",{message});
})
app.listen(8080,()=>{
    console.log("server is working");
})