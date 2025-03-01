const mongoose = require('mongoose');

let commentsSchema = mongoose.Schema({
    comments : {
        type: String,
        required: true
    },
    status:{
        type: Boolean,
        default: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    blogPostId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog',
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }
},{
    timestamps : true
})



let comments = mongoose.model('comments', commentsSchema);
module.exports = comments;
