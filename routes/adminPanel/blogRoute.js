const express = require('express');
const routes = express.Router();
const blogController = require("../../controller/adminController/blogController");
const blog = require('../../model/blogModel');
routes.get('/', blogController.blogs);
routes.post('/addBlogs', blog.uploadBlogImage, blogController.addBlogs);
routes.get('/showBlogs', blogController.showBlogs);
routes.get('/changeStatus', blogController.changeStatus);
routes.get('/editBlogs', blogController.editBlogs);
routes.get('/deleteBlogs', blogController.deleteBlogs);
routes.post('/updateBlogs', blogController.updateBlogs);

module.exports = routes;