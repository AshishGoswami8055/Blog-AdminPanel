const express = require("express");
const port = 7000;
const path = require("path");
const app = express();
const db = require("./config/db");

// passport 
const passport = require("passport");
const session = require("express-session");
const localStrategy = require("./config/passportLocalStrategy");
const cookieParser = require("cookie-parser");
// connect flash
const flash = require("connect-flash");
const flashMessage = require("./config/flashMessage");

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));


app.use(session({
    name: "admin",
    secret: "encrypted",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60*60*1000
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthAdminData);
app.use(flash());
app.use(flashMessage.setFlash);

app.use("/", require('./routes/userPanel/userRoute'));

app.listen(port, (err)=> {
    if(err){
        console.log(err);
        return false;
    }
    console.log("Server is Running on port :-", port);
})