const mongoose = require('mongoose');

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
    description: {
        type: String,
        required: true
    },
    blogContent:{
        type: String,
        required: true
    },
    status:{
        type: Boolean,
        default: true
    },
},{
    timestamps : true
})



let blog = mongoose.model('blog', blogSchema);
module.exports = blog;
