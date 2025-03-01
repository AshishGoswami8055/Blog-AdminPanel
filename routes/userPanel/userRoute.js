const express = require('express');
const routes = express.Router();
const userController = require('../../controller/userController/userController');
const passport = require('passport');

routes.get('/',userController.home);
routes.get('/userLogin',userController.userLogin);
routes.get('/userSignUp',userController.userSignUp);
routes.get('/singlePage/:id',userController.singlePage);
routes.post('/userRegistration', userController.userRegistration);
routes.post('/checkUserAuth', passport.authenticate("userAuth",{failureRedirect: '/userLogin'}), userController.checkUserAuth);
routes.post('/uploadComments',userController.uploadComments)

routes.get("/like/:id",userController.like);
routes.get("/dislike/:id",userController.dislike);


// Google Login Route
routes.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Callback Route
routes.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/userLogin' }),
    (req, res) => {
        res.redirect('/'); // Redirect to dashboard after login
    }
);
routes.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        
        req.session.destroy(() => {
            res.redirect('/userLogin'); // Redirect to login page after logout
        });
    });
});

routes.use("/admin", require('../../routes/adminPanel/adminRoute'));

module.exports = routes;