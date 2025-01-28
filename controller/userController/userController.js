module.exports.home = async(req,res)=>{
    try{
        return res.render('userPanel/home');
    }catch(err){
        console.log(err);
        return res.redirect('back');
    }
}