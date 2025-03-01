const admin = require("../../model/adminModel");
const path = require('path');
const fs = require('fs');
const nodemailer = require("nodemailer");
const AesEncryption = require('aes-encryption')
const aes = new AesEncryption()
const {validationResult } = require("express-validator");
const blog = require("../../model/blogModel");
const category = require("../../model/categoryModel");
const user = require("../../model/userModel");
const comments = require("../../model/commentsModel");
//Auth
module.exports.adminLogin = (req,res)=>{
    try{
        return res.render('adminPanel/auth/login')
    }catch(err){
        req.flash('error',"Something went wrong!!!");
        console.log(err);
        return res.redirect('back');
    }
}
module.exports.auth = async (req,res)=>{
    try{
        let authenticate = await admin.findByIdAndUpdate(req.query.id,{auth:true});
        return res.render('adminPanel/auth/verifySuccess');
    }catch(err){
        req.flash('error',"Something went wrong!!!");
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.checkVerificationAuth = async (req,res) =>{
    try{
        console.log("User Founded",req.user);
        const checkAuth = await admin.findOne({email: req.user.email });             
        if (checkAuth.auth) {
            req.flash('success', 'Account verified successfully!');
            return res.json(checkAuth);
        }else{
            return res.json(checkAuth);
        }  
    } catch (error) {
       
        console.error("Error during auth check:", error);
        req.flash('error', `An error occurred during verification. Please try again. ${error}`);
        return res.redirect('back')
    }
}

module.exports.twoStepVerification = async (req,res)=>{
    try{
        return res.render("adminPanel/auth/twoStepVerify");
    }
    catch(err){
        req.flash('error',"Something went wrong!!!");
        console.log(err);
        return res.redirect('back'); 
    }
}

module.exports.logOut = async (req,res)=>{
    try{
        await admin.findByIdAndUpdate(req.query.id,{auth:false})
        res.clearCookie("admin");
        req.flash('success',"Admin Logout Successfully.");
        return res.redirect('/admin')
    }catch(err){
        req.flash('error',"Something went wrong!!!");
        console.log(err);
        return false;
    }
}
module.exports.checkUserExist = async (req,res)=>{
    try{
        
        if(req.user.auth){
            req.flash('success', 'Admin Login Successfully.');
            return res.redirect(`/admin/dashboard`);
        }
        else{
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: "avengersfan60@gmail.com",
                    pass: "yvfjamfhmkojraxf",
                },
            });
            const info = await transporter.sendMail({
                from: 'avengersfan60@gmail.com', // Use a professional sender email address
                to: req.user.email, // List of receivers
                subject: "Verify Your Account", // Subject line
                html: `
                <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 12px; background-color: #ffffff; border: 1px solid #e6e6e6; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                    <h2 style="text-align: center; color: #333333; font-size: 24px; margin-bottom: 15px;">Account Verification</h2>
                    
                    <p style="text-align: center; font-size: 16px; color: #555555; line-height: 1.6;">
                        Hi <strong>${req.user.name || "there"}</strong>,<br>
                        Thank you for signing up for <strong>Your Website</strong>. To verify your account, please click the button below.
                    </p>
                    
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="https://blog-admin-panel-five.vercel.app/admin/auth/?id=${req.user._id}" 
                           style="display: inline-block; background-color: #4caf50; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; padding: 12px 30px; border-radius: 30px; transition: background-color 0.3s;">
                           Verify My Account
                        </a>
                    </div>
                    
                    <p style="text-align: center; font-size: 14px; color: #777777; line-height: 1.6;">
                        If you did not request this, please ignore this email or contact support.
                    </p>
                    
                    <div style="text-align: center; font-size: 12px; color: #aaaaaa; margin-top: 20px; border-top: 1px solid #eeeeee; padding-top: 10px;">
                        &copy; ${new Date().getFullYear()} Your Website. All rights reserved.<br>
                        <a href="#" style="color: #4caf50; text-decoration: none;">Privacy Policy</a> | 
                        <a href="#" style="color: #4caf50; text-decoration: none;">Terms of Service</a>
                    </div>
                </div>
                
                <!-- Optional fallback for email clients that don't render HTML well -->
             
                `,
                
            });
            req.flash('success', 'Verification Email has been Send.');
            return res.redirect(`/admin/twoStepVerification/${req.user.id}`);
        }
    }catch(err){
        req.flash('error',"Something went wrong!!!");
        console.log(err);
        return false;
    }
}

// Forgot Password 
module.exports.forgotPassword = async(req, res)=>{
    try {
        return res.render('adminPanel/forgotPassword/forgotPass');
    } catch (error) {
        req.flash('error',"Something went wrong!!!");
        console.log(error);
        return res.redirect('back');        
    }
}
module.exports.forgotPassEmail = async(req, res)=>{
    try {
        console.log(req.body);
        let isAdminExistCount = await admin.find({email: req.body.email}).countDocuments();
        console.log(isAdminExistCount);
        if(isAdminExistCount == 1){
            let adminData = await admin.findOne({email: req.body.email});
            let otp = Math.floor(1000 + Math.random() * 1000)
            
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: "avengersfan60@gmail.com",
                    pass: "yvfjamfhmkojraxf",
                },
            });
            
           
            aes.setSecretKey('11122233344455566677788822244455555555555555555231231321313aaaff')
            const encryptedOTP = aes.encrypt(JSON.stringify(otp))
            const encryptedEmail = aes.encrypt(JSON.stringify(req.body.email))
            res.cookie('CredentialsOTP',encryptedOTP)
            res.cookie('CredentialsEmail',encryptedEmail)
            const info = await transporter.sendMail({
                from: 'avengersfan60@gmail.com', // sender address
                to: adminData.email, // recipient's email address
                subject: "Password Reset OTP", // Subject line
                html: `
                <p>Dear ${adminData.name || "User"},</p>
                <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed with the reset:</p>
                <h2 style="color: #333;">${otp}</h2>
                <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone for your account's security.</p>
                <p>If you did not request a password reset, please ignore this email or contact our support team immediately.</p>
                <br>
                <p>Best regards,</p>
                <p><strong>Star Admin Panel</strong></p>
                `,
            });
            req.flash('success',"OTP has send to your Email.");
            return res.redirect('/admin/otpPage');
        }
        else{
            req.flash('error',"Incorrect Admin Email!!!");
            console.log("Admin Email is Wrong!!");
            return res.redirect('back');
        }
    } catch (error) {
        req.flash('error',"Something went wrong!!!");
        console.log(error);
        return res.redirect('back');        
    }
}

module.exports.otpPage = async(req, res)=>{
    try { 
        return res.render('adminPanel/forgotPassword/otpPage');
    } catch (error) {
        req.flash('error',"Something went wrong!!!");
        console.log(error);
        return res.redirect('back');        
    }
}
module.exports.verifyOTP = async(req, res)=>{
    try { 
        aes.setSecretKey('11122233344455566677788822244455555555555555555231231321313aaaff')
        const decrypted = aes.decrypt(req.cookies.CredentialsOTP)
        let decryptedOTP = JSON.parse(decrypted)
        // console.log("hello there ",JSON.parse(decrypted));
        if(req.body.otp == decryptedOTP){
            console.log("OTP Verify Successfully.");
            res.clearCookie("CredentialsOTP");
            req.flash('success',"OTP Verification Successfully.");
            return res.redirect('/admin/newPasswordPage');        
        }
        else{
            req.flash('error',"Incorrect OTP!!!");
            console.log("OTP Verification Failed!!");
            return res.redirect('back');        
        }
    } catch (error) {
        req.flash('error',"Something went wrong!!!");
        console.log(error);
        return res.redirect('back');        
    }
}

module.exports.newPasswordPage = async(req, res)=>{
    try { 
        return res.render('adminPanel/forgotPassword/newPassword');
    } catch (error) {
        req.flash('error',"Something went wrong!!!");
        console.log(error);
        return res.redirect('back');        
    }
}
module.exports.newPassword = async(req, res)=>{
    try { 
        aes.setSecretKey('11122233344455566677788822244455555555555555555231231321313aaaff')
        const decrypted = aes.decrypt(req.cookies.CredentialsEmail)
        let decryptedOTP = JSON.parse(decrypted)
        let adminData = await admin.findOne({email: decryptedOTP});
        if(adminData.password != req.body.newPassword){
            if(req.body.newPassword == req.body.confirmPassword){
                adminData.previousPass = adminData.password
                adminData.password = req.body.newPassword;
                // let newAdminData = await admin.findByIdAndUpdate(adminData._id,{password:req.body.newPassword});
                let newAdminData = await admin.findByIdAndUpdate(adminData._id,adminData);
                res.clearCookie("CredentialsEmail");
                req.flash('success',"Password Updated Successfully.");
                console.log("Password Updated Successfully.");
                return res.redirect('/admin');
            }
            else{
                req.flash('error',"New password and Confirm password Should be Same!!!");
                console.log("New password and Confirm password Should be Same!!");
                return res.redirect('back');        
            }
        }
        else{
            req.flash('error',"Previous password and Current password Should be Different!!!");
            console.log("Previous password and Current password Should be Different!!");
            return res.redirect('back');        
        }
        
    } catch (error) {
        req.flash('error',"Something went wrong!!!");
        console.log(error);
        return res.redirect('back');        
    }
}

//dashboard
module.exports.dashboard = async (req,res)=>{
    try{
        let totalBlogs = await blog.find();
        let totalCategories = await category.find();
        let totalUsers = await user.find();
        let totalAdmins = await admin.find();
        let totalComments = await comments.find();
        // let totalComments = ;
        return res.render('adminPanel/adminPages/dashboard',{
            totalBlogs,
            totalCategories,
            totalUsers,
            totalAdmins,
            totalComments
        })
    }catch(err){
        req.flash('error',"Something went wrong!!!");
        console.log(err);
        return false;
    }
}

module.exports.adminForm = (req, res) => {
    try {
        return res.render('adminPanel/adminPages/addAdmin', {
            errorsData: {},
            oldData: {}
        });
    } catch (err) {
        req.flash('error', "Something went wrong!!!");
        console.error(err);
        return res.redirect("back"); // Redirect instead of returning false
    }
};
module.exports.insertAdmin = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render("adminPanel/adminPages/addAdmin", {
            errorsData: errors.mapped(),
            oldData: req.body
        });
    }

    try {
        console.log(req.body);
        console.log(req.file);

        // Ensure file upload is handled properly
        let imagePath = req.file?.filename ? admin.imagePath + "/" + req.file.filename : null;
        req.body.adminImage = imagePath;

        await admin.create(req.body);
        req.flash('success', "Admin Registration Successfully.");
        return res.redirect("back");
    } catch (err) {
        req.flash('error', "Something went wrong!!!");
        console.error(err);
        return res.redirect("back");
    }
};
module.exports.viewAdmin = async (req,res)=>{
    try{
        let AdminData = await admin.find();
        return res.render('adminPanel/adminPages/viewAdmin',{AdminData})
    }catch(err){
        req.flash('error',"Something went wrong!!!");
        console.log(err);
        return false;
    }
}
module.exports.deleteAdmin = async (req,res)=>{
    try{
        let AdminData = await admin.findById(req.query.id);
        let oldImagePath =  path.join(__dirname,"../..",AdminData.adminImage);
        console.log(oldImagePath);
        
        try{
            fs.unlinkSync(oldImagePath);
        }
        catch(e){   
            req.flash('error',"Image Not Found!!!");
            console.log("Image Not Found!!!", e);
        }
        let deleteAdmin = await admin.findByIdAndDelete(req.query.id);
        if(deleteAdmin){
            req.flash('success',"Data Deleted Successfully.");
            console.log("Data Deleted Successfully");
            return res.redirect("/admin/viewAdmin");
        }
        else{
            console.log("Something went wrong!!");
            return res.redirect("back");
        }
    }catch(err){
        req.flash('error',"Something went wrong!!!");
        console.log(err);
        return false;
    }
}
module.exports.updateAdmin = async (req,res)=>{
    try{
        let AdminData = await admin.findById(req.query.id);
        return res.render('adminPanel/adminPages/editAdmin',{AdminData})
    }catch(err){
        req.flash('error',"Something went wrong!!!");
        console.log(err);
        return false;
    }
}
module.exports.editAdmin = async (req,res)=>{
    try{
        
        let adminData = await admin.findById(req.body.id);
        if(req.file){
            // Delete Previous Image
            let oldImagePath = path.join(__dirname,"../..",adminData.adminImage);
            try{
                fs.unlinkSync(oldImagePath);
            }
            catch(err){
                req.flash('error',"Image Not Found!!!");
                console.log("Image Not Found!!, error :- ",err);
            }
            // Update ( Set New Data and Image Path ) 
            let newImagePath = admin.imagePath + "/" + req.file.filename;
            req.body.adminImage = newImagePath;
            await admin.findByIdAndUpdate(req.body.id,req.body);
         }
        else{
            req.body.adminImage = adminData.adminImage;
            await admin.findByIdAndUpdate(req.body.id,req.body);
        }
        req.flash('success',"Data Updated Successfully.");
        console.log("Data Updated Successfully.");
        return res.redirect('/admin/viewAdmin');
        
    }catch(err){
        req.flash('error',"Something went wrong!!!");
        console.log(err);
        return false;
    }
}