const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: false
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"comments"
    }]
},{
    timestamps : true
})



let user = mongoose.model('user', userSchema);
module.exports = user;
