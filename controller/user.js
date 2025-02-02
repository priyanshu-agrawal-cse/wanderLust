const User = require("../models/user.js");

module.exports.renderSignUpForm =(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp =async(req,res,next)=>{
    try{
    let {username, email ,password} = req.body;
    const newUser = new User({username,email});
    const ru = await User.register(newUser,password);

    req.login(ru,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "thanks for registering on wonderLust");
        res.redirect("/listings");
    })

    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
   
}

module.exports.renderLoginForm =(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.logIn = async (req,res)=>{
    req.flash("success","succsessfully log in");
    let redirectUrl =res.locals.redirectUrl ||"/listings"
    res.redirect(redirectUrl);
}

module.exports.logOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","successfully logout");
        res.redirect("/listings");
    })
}