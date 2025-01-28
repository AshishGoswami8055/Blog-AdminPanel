const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://avengersfan60:O13xWOXCYFMeRWV1@cartdata.5o7ra.mongodb.net/StarAdminPanel");

const db = mongoose.connection;

db.once('open',(err)=>{
    if(err){
        console.log(err);
        return false;
    }
    console.log("Database Connected Successfully.");
})
module.exports = db;