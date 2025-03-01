const category = require("../../model/categoryModel");
const blog = require("../../model/blogModel");

module.exports.category = (req, res)=>{
    try {
        return res.render('adminPanel/categoryPages/category');
    } catch (error) {   
        req.flash('error',"Something went wrong!!!");
        console.log(error);
        return res.redirect('back');
    }
}
module.exports.addCategory = async (req, res)=>{
    try {
        console.log(req.body);
        let addCategory = await category.create(req.body);
        if(addCategory){
            req.flash('success', 'Category added successfully.')
        }
        return res.redirect('back');
    } catch (error) {   
        req.flash('error',"Something went wrong!!!");
        console.log(error);
        return res.redirect('back');
    }
}
module.exports.showCategory = async (req, res)=>{
    try {
        let categoryData = await category.find();
        return res.render('adminPanel/categoryPages/showCategory',{
            categoryData
        });
    } catch (error) {   
        req.flash('error',"Something went wrong!!!");
        console.log(error);
        return res.redirect('back');
    }
}
module.exports.changeStatus = async (req, res)=>{
    try {
        
        if(req.query.status == "true"){
            req.flash('success',"Category Active");
        }
        else{
            req.flash('info',"Category Deactive!");
        }
        await category.findByIdAndUpdate(req.query.id,{status:req.query.status});
        return res.redirect('back');
    } catch (error) {   
        req.flash('error',"Something went wrong!!!");
        console.log(error);
        return res.redirect('back');
    }
}
module.exports.editCategory = async (req, res)=>{
    try {
        let categoryData = await category.findById(req.query.id); 
        return res.render('adminPanel/categoryPages/editCategory',{
            categoryData
        });
    } catch (error) {      
        req.flash('error',"Something went wrong!!!");
        console.log(error);
        return res.redirect('back');
    }
}
module.exports.updateCategory = async (req, res)=>{
    try {
        console.log(req.body);
        let addCategory = await category.findByIdAndUpdate(req.body.id,req.body);
        req.flash('success',"Category Updated Successfully.");
        return res.redirect('/admin/category/showCategory');
    } catch (error) {   
        req.flash('error',"Something went wrong!!!");
        console.log(error);
        return res.redirect('back');
    }
}
module.exports.deleteCategory = async (req,res)=>{
    try{
        let catData = await category.findById(req.query.id);
        if(catData.blogsIds.length > 0){
            catData.blogsIds.map(async(v, i)=>{
                let blogToDeactive = await blog.findByIdAndDelete(v);
            })
            req.flash('warning',"Blogs related to this category have also been deleted!");
        }
        
        let deleteCategory = await category.findByIdAndDelete(req.query.id);
        if(deleteCategory){
            req.flash('success',"Category Deleted Successfully.");
            return res.redirect('back');
        }
        else{
            req.flash('error',"Something went Wrong Category can't be Deleted!!!");
            return res.redirect('back');
        }
    }
    catch(err){
        req.flash('error',"Something went wrong!!!");
        console.log("Something went Wrong, error :- ",err);
        return res.redirect("back");
    }
}