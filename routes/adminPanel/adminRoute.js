const express = require('express');
const routes = express.Router();
const adminController = require('../../controller/adminController/adminController');
const admin = require('../../model/adminModel');
const Passport = require('passport');
const {check} = require("express-validator");
const url = require('../../config/url');
routes.use(url);

// Auth  
routes.get('/',adminController.adminLogin);
routes.get('/logOut',adminController.logOut);
routes.post('/checkUserExist',Passport.authenticate('local',{failureRedirect : '/admin'}),adminController.checkUserExist);
routes.get('/auth',adminController.auth);
routes.get("/checkVerificationAuth", adminController.checkVerificationAuth);
routes.get("/twoStepVerification/:id",adminController.twoStepVerification);

// Admin Panel 
routes.get('/dashboard',Passport.checkAuth,adminController.dashboard);
routes.get('/adminForm',Passport.checkAuth,adminController.adminForm);
routes.post('/insertAdmin',admin.uploadImageFile,[
    check('name').notEmpty().withMessage("Name is Required").isLength({min : 2}).withMessage("Name Shoud be at least 2 characters"),
    check('email').notEmpty().withMessage("Email is Required").isEmail().withMessage("Enter a Valid Email").custom(async (value) => {
        let adminData = await admin.findOne({ email: value });
        if (adminData) {
        throw new Error('A user already exists with this e-mail address');
        }
    }),
    check('password')
    .notEmpty().withMessage("Password is Required")
    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,25}$/)
    .withMessage("Password must be 8 to 25 characters long and include at least one digit, one lowercase letter, one uppercase letter, and one special character"),
  

    check('hobby').notEmpty().withMessage("Hobby is Required"),
    check('gender').notEmpty().withMessage("Gender is Required"),
    check('description').notEmpty().withMessage("Decription is Required").isLength({min:1, max: 500}).withMessage("Message should be at least 1 character and Maximum 500 characters"),
],adminController.insertAdmin);
routes.get('/viewAdmin',adminController.viewAdmin);
routes.get('/deleteAdmin',adminController.deleteAdmin);
routes.get('/updateAdmin',adminController.updateAdmin);
routes.post('/editAdmin',admin.uploadImageFile,adminController.editAdmin);

// Forgot Password

routes.get('/forgotPassword',adminController.forgotPassword);
routes.post('/forgotPassEmail',adminController.forgotPassEmail);
routes.get('/otpPage',adminController.otpPage);
routes.post('/verifyOTP',adminController.verifyOTP);
routes.get('/newPasswordPage',adminController.newPasswordPage);
routes.post('/newPassword',adminController.newPassword);

//Changing Routes
routes.use('/category',require('./categoryRoute'));
routes.use('/blogs',require('./blogRoute'));
module.exports = routes;