const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const imgPath = '/uploads/adminImages' 
let adminSchema = mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    previousPass : {
        type: String,
    },
    hobby : {
        type: Array,
    },
    gender : {
        type: String,
        required: true
    },
    adminImage : {
        type: String,
    },
    description : {
        type: String,
        required: true
    },
    auth : {
        type : Boolean,
        default : false
    }
},{
    timestamps : true
})

const adminImageSchema = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,path.join(__dirname,"..",imgPath));
    },
    filename : (req,file,cb)=>{
        cb(null,file.fieldname+"-"+Date.now());
    }
})

adminSchema.statics.uploadImageFile = multer({storage: adminImageSchema}).single("adminImage");
adminSchema.statics.imagePath = imgPath;

let admin = mongoose.model('admin', adminSchema);
module.exports = admin;
