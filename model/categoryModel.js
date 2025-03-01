const mongoose = require('mongoose');

let categorySchema = mongoose.Schema({
    categoryName : {
        type: String,
        required: true
    },
    status:{
        type: Boolean,
        default: true
    },
    blogsIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog',
    }]
},{
    timestamps : true
})



let category = mongoose.model('category', categorySchema);
module.exports = category;
