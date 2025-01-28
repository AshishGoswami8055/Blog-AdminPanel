const express = require('express');
const routes = express.Router();
const adminController = require('../../controller/adminController/adminController');
const admin = require('../../model/adminModel');
const Passport = require('passport');
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
routes.post('/insertAdmin',admin.uploadImageFile,adminController.insertAdmin);
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