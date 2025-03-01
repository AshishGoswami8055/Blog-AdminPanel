const mongoose = require('mongoose');
const multer = require("multer");
const path = require("path");
const blogImagePath = "/uploads/blogImages";
let blogSchema = mongoose.Schema({
    categoryId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'category',
        required: true
    },
    title:{
        type: String,
        required: true
    },
    blogImage:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    blogContent:{
        type: String,
        required: true
    },
    commentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'comments'
    }],
    status:{
        type: Boolean,
        default: true
    },
},{
    timestamps : true
})

const imageSchema = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, path.join(__dirname,"..",blogImagePath));
    },
    filename:(req, file, cb)=>{
        cb(null, file.fieldname+"-"+Date.now());
    }
})

blogSchema.statics.uploadBlogImage = multer({storage: imageSchema}).single("blogImage");
blogSchema.statics.blogImagePath = blogImagePath;

let blog = mongoose.model('blog', blogSchema);
module.exports = blog;
