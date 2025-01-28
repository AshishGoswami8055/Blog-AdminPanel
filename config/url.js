module.exports = (req, res, next) => {
    res.locals.currentURL = req.url; 
    next();
};