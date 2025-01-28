const passport = require('passport');
const admin = require('../model/adminModel');
const LocalStrategy = require('passport-local').Strategy;
const nodemailer = require("nodemailer");

passport.use(new LocalStrategy(
{
    usernameField: 'email',
    passReqToCallback: true, 
},async function(req,email,password,done){
    let adminDataCount = await admin.find({email: email}).countDocuments();
    if(adminDataCount == 1){
        let adminData = await admin.findOne({email: email});
        console.log(adminData,password);
        if(adminData.password == password){
            return done(null, adminData);
        }
        else if(adminData.previousPass == password){
            req.flash('error', 'You have changed this password.');
            return done(null,false);
        }
        else{
            req.flash('error', 'Invalid password. Please try again.');
            return done(null,false);
        }
    }
    else{
        console.log("User Not Found");
        req.flash('error', 'User not found. Please register first.');
        return done(null,false);
    }
}))

passport.serializeUser(function(user,done){
    return done(null,user._id);
});

passport.deserializeUser(async function(id,done){
    let adminData = await admin.findById(id);
    if(adminData){
        return done(null,adminData);
    }
    else{
        return done(null,false);
    }
})

passport.setAuthAdminData = async function(req, res, next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}

passport.checkAuth = async function(req, res, next){
    
    if(req.isAuthenticated() && req.user.auth){
        next();
    }
    else{
        return res.redirect("/admin");
    }
}

module.exports = passport;