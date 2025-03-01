require("dotenv").config();
const passport = require('passport');
const admin = require('../model/adminModel');
const user = require('../model/userModel');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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
passport.use("userAuth",new LocalStrategy(
{
    usernameField: 'email',
    passReqToCallback: true, 
},async function(req,email,password,done){
    let userDataCount = await user.find({email: email}).countDocuments();
    if(userDataCount == 1){
        let userData = await user.findOne({email: email});
        console.log(userData,password);
        if(userData.password == password){
            return done(null, userData);
        }
        else if(userData.previousPass == password){
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

// Google OAuth Strategy
passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_clientID,
        clientSecret: process.env.GOOGLE_clientSecret,
        callbackURL: process.env.GOOGLE_callbackURL,
        passReqToCallback: true
    },
    async function(req, accessToken, refreshToken, profile, done) {
        try {
            let existingUser = await user.findOne({ email: profile.emails[0].value });
            if (existingUser) {
                return done(null, existingUser);
            } else {
                let newUser = new user({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    password: profile.displayName,
                    profileImage: profile.photos[0].value.replace('=s96-c','')
                });

                await newUser.save();
                return done(null, newUser);
            }
        } catch (error) {
            return done(error, false);
        }
    }
));

passport.serializeUser(function(user,done){
    return done(null,user._id);
});

passport.deserializeUser(async function(id,done){
    let adminData = await admin.findById(id);
    if(adminData){
        return done(null,adminData);
    }
    else{
        let userData = await user.findById(id);
        if(userData){
            return done(null,userData);
        }else{
            return done(null,false);
        }
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