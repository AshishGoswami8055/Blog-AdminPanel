const flash = require('connect-flash');
module.exports.setFlash = async(req,res,next)=>{
    res.locals.Flash = {
        'success': req.flash('success'),
        'info': req.flash('info'),
        'warning': req.flash('warning'),
        'error': req.flash('error')
    }
    next();
}