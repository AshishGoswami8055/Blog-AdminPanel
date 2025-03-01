const moment = require("moment");
const blog = require("../../model/blogModel");
const category = require("../../model/categoryModel");
const user = require("../../model/userModel");
const comments = require("../../model/commentsModel");

module.exports.home = async(req,res)=>{
    try{
        let categories = await category.find({status:true}) || [];
        let blogData = await blog.find({status:true}).populate("categoryId").exec()  || [];
        let totalBlogs = 0;
        categories.map((v, i)=>{
            totalBlogs+=v.blogsIds.length;
        })
        blogData.map((v,i)=>{
            v.time = moment(v.createdAt).fromNow();
        })

        return res.render('userPanel/home',{
            categories,
            totalBlogs,
            blogData
        });
    }catch(err){
        console.log(err);
        return res.redirect('back');
    }
}
module.exports.singlePage = async (req,res)=>{
    try {
        let categories = await category.find({status:true});
        let commentsData = await comments.find({status:true,blogPostId:req.params.id}).populate("userId").exec();
        let blogData = await blog.find({status:true}).populate("categoryId").exec();
        let singleBlogData = await blog.findById(req.params.id).populate("categoryId").exec();
        singleBlogData.time = moment(singleBlogData.createdAt).fromNow();
        let totalBlogs = 0;
        categories.map((v, i)=>{
            totalBlogs+=v.blogsIds.length;
        })
        blogData.map((v,i)=>{
            v.time = moment(v.createdAt).fromNow();
        })
        commentsData.map((v,i)=>{
            v.time = moment(v.createdAt).fromNow();
        })
        console.log(commentsData);
        
        return res.render("userPanel/singleBlogPage",{
            singleBlogData,
            blogData,
            totalBlogs,
            categories,
            commentsData
        });
    } catch (error) {
        console.log("Something is Wrong",error);
        return res.redirect('back');
    }
}
module.exports.userLogin = async(req,res)=>{
    try{
        let categories = await category.find({status:true});
        let blogData = await blog.find({status:true}).populate("categoryId").exec();
        let totalBlogs = 0;
        categories.map((v, i)=>{
            totalBlogs+=v.blogsIds.length;
        })
        blogData.map((v,i)=>{
            v.time = moment(v.createdAt).fromNow();
        })
        return res.render("userPanel/userLogin",{
            categories,
            totalBlogs,
            blogData
        });
    }
    catch(err){
        console.log("Something is Wrong",error);
        return res.redirect('back');
    }
}
module.exports.userSignUp = async(req,res)=>{
    try{
        let categories = await category.find({status:true});
        let blogData = await blog.find({status:true}).populate("categoryId").exec();
        let totalBlogs = 0;
        categories.map((v, i)=>{
            totalBlogs+=v.blogsIds.length;
        })
        blogData.map((v,i)=>{
            v.time = moment(v.createdAt).fromNow();
        })
        return res.render("userPanel/userSignUp",{
            categories,
            totalBlogs,
            blogData
        });
    }
    catch(err){
        console.log("Something is Wrong",error);
        return res.redirect('back');
    }
}

module.exports.userRegistration = async (req, res)=>{
    try{
        if(req.body.password == req.body.conPass){
            let userData = await user.create(req.body);
            return res.redirect('/userLogin');
        }   
        else{
            console.log("Password should not be different from confirm password");
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.checkUserAuth = async (req, res)=>{
    try{
        return res.redirect('/');
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}
module.exports.uploadComments = async (req, res)=>{
    try{
        console.log(res.locals.user._id);
        req.body.userId = res.locals.user._id
        req.body.blogPostId = req.body.blogId;
        let commentData = await comments.create(req.body);
        
        let userData = await user.findById(res.locals.user._id);
        let blogData = await blog.findById(req.body.blogId)
        userData.comments.push(commentData._id);
        blogData.commentIds.push(commentData._id)
        await blog.findByIdAndUpdate(req.body.blogId, blogData);
        await user.findByIdAndUpdate(res.locals.user._id, userData);
        return res.redirect('back');
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.like = async (req, res) => {
    try {
        const userId = res.locals.user._id;
        const comment = await comments.findById(req.params.id);

        if (comment.likes.includes(userId)) {
            // If the user already liked, remove them (toggle off)
            await comments.updateOne({ _id: req.params.id }, { $pull: { likes: userId } });
        } else {
            // If the user disliked before, remove from dislikes first
            await comments.updateOne(
                { _id: req.params.id },
                {
                    $pull: { dislikes: userId }, // Ensure they're not disliking at the same time
                    $push: { likes: userId } // Add them to likes
                }
            );
        }

        return res.redirect("back");
    } catch (err) {
        console.error("Something went wrong", err);
        return res.redirect("back");
    }
};

module.exports.dislike = async (req, res) => {
    try {
        const userId = res.locals.user._id;
        const comment = await comments.findById(req.params.id);

        if (comment.dislikes.includes(userId)) {
            // If the user already disliked, remove them (toggle off)
            await comments.updateOne({ _id: req.params.id }, { $pull: { dislikes: userId } });
        } else {
            // If the user liked before, remove from likes first
            await comments.updateOne(
                { _id: req.params.id },
                {
                    $pull: { likes: userId }, // Ensure they're not liking at the same time
                    $push: { dislikes: userId } // Add them to dislikes
                }
            );
        }

        return res.redirect("back");
    } catch (err) {
        console.error("Something went wrong", err);
        return res.redirect("back");
    }
};
