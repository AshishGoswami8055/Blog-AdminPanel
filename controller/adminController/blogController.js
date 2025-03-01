const blog = require('../../model/blogModel');
const category = require('../../model/categoryModel');

module.exports.blogs = async (req, res)=>{
    try {
        let categoryData = await category.find({status:true});
        return res.render("adminPanel/blogPages/insertBlogs",{
            categoryData
        })
    } catch (error) {
        req.flash('error',"Something went wrong!!!");
        console.log(error);
        return res.redirect('back');
    }
}
module.exports.addBlogs = async (req, res)=>{
    try {
        req.body.blogImage = blog.blogImagePath+"/"+req.file.filename;
        console.log(req.body);
        
        let addBlogData = await blog.create(req.body);
        if(addBlogData){
            let categoryBlogs = await category.findById(addBlogData.categoryId);
            categoryBlogs.blogsIds.push(addBlogData._id);
            await category.findByIdAndUpdate(addBlogData.categoryId,categoryBlogs)
            req.flash('success',"Blog Added successfully.");
            return res.redirect('/admin/blogs/showBlogs');
        }
        else{
            req.flash('error',"An Error Occurred While Creating the Blog!!!");
            console.log("An Error Occurred While Creating the Blog");
            return res.redirect('back');
        }
    } catch (error) {
        req.flash('error',"Something went wrong!!!");
        console.log(error);
        return res.redirect('back');
    }
}
module.exports.showBlogs = async (req, res)=>{
    try {
        let blogData = await blog.find().populate("categoryId").exec();
        return res.render("adminPanel/blogPages/showBlogs",{
            blogData
        })
    } catch (error) {
        req.flash('error',"Something went wrong!!!");
        console.log(error);
        return res.redirect('back');
    }
}
module.exports.changeStatus = async (req, res)=>{
    try {
        if(req.query.status == "true"){
            req.flash('success',"Blog Active");
        }
        else{
            req.flash('info',"Blog Deactive!");
        }
        await blog.findByIdAndUpdate(req.query.id,{status:req.query.status});
        return res.redirect('back');
    } catch (error) {
        req.flash('error',"Something went wrong!!!");
        console.log(error);
        return res.redirect('back');
    }
}
module.exports.editBlogs = async (req, res)=>{
    try {
        let blogData = await blog.findById(req.query.id).populate("categoryId").exec();
        let categoryData = await category.find({status:true});
        return res.render('adminPanel/blogPages/editBlogs',{
            blogData,
            categoryData
        });
    } catch (error) {
        req.flash('error',"Something went wrong!!!");
        console.log(error);
        return res.redirect('back');
    }
}
module.exports.deleteBlogs = async (req,res)=>{
    try{
        let blogData = await blog.findById(req.query.id);
        let categoryData = await category.findById(blogData.categoryId);
        let deleteBlog = await blog.findByIdAndDelete(req.query.id);
        if(deleteBlog){
            let deleteCatIndex;
            categoryData.blogsIds.map((v,i)=>{
                if(categoryData.blogsIds[i] == blogData._id){
                    deleteCatIndex = i;
                }
            })
            categoryData.blogsIds.splice(deleteCatIndex,1);
            await category.findByIdAndUpdate(blogData.categoryId,categoryData);
            req.flash('success',"Blog Deleted Successfully.");
            console.log("Blog Deleted Successfully.");
            return res.redirect("back");
        }
    }
    catch(err){
        req.flash('error',"Something went wrong!!!");
        console.log("Something went Wrong, error :- ",err);
        return res.redirect('back');
    }
}
module.exports.updateBlogs = async (req, res)=>{
    try {
        
        let blogData = await blog.findById(req.body.id);
        let previousCategory = await category.findById(blogData.categoryId);
        console.log(previousCategory);
        
        let addBlogData = await blog.findByIdAndUpdate(req.body.id,req.body);
        if(addBlogData){
            let categoryBlogs = await category.findById(req.body.categoryId);
            let catNotExist = true;
            let toDeleteCatIndex;
            categoryBlogs.blogsIds.map((v,i)=>{
                if(categoryBlogs.blogsIds[i] != addBlogData.previousCat){
                    catNotExist = false;
                }
            })
            previousCategory.blogsIds.map((v,i)=>{
                if(previousCategory.blogsIds[i] == blogData.id){
                    toDeleteCatIndex = i;
                }
            })
            
            if(catNotExist){
                previousCategory.blogsIds.splice(toDeleteCatIndex, 1);
                categoryBlogs.blogsIds.push(addBlogData._id);
            }
            req.flash('success',"Blog Updated Successfully.");
            await category.findByIdAndUpdate(req.body.categoryId,categoryBlogs)   
            await category.findByIdAndUpdate(blogData.categoryId,previousCategory)   
            return res.redirect('/admin/blogs/showBlogs');
        }
        else{
            req.flash('error',"An error occurred while updating the blog!!!");
            console.log("An Error occurred!! while adding Blog.");
            return res.redirect('back');
        }
    } catch (error) {
        req.flash('error',"Something went wrong!!!");
        console.log(error);
        return res.redirect('back');
    }
}