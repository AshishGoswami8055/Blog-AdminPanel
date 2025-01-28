const express = require('express');
const routes = express.Router();
const blogController = require("../../controller/adminController/blogController");
routes.get('/', blogController.blogs);
routes.post('/addBlogs', blogController.addBlogs);
routes.get('/showBlogs', blogController.showBlogs);
routes.get('/changeStatus', blogController.changeStatus);
routes.get('/editBlogs', blogController.editBlogs);
routes.get('/deleteBlogs', blogController.deleteBlogs);
routes.post('/updateBlogs', blogController.updateBlogs);

module.exports = routes;