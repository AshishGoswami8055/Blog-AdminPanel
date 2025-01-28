const express = require('express');
const routes = express.Router();
const categoryController = require('../../controller/adminController/categoryController');
routes.get('/', categoryController.category);
routes.post('/addCategory', categoryController.addCategory);
routes.get('/showCategory', categoryController.showCategory);
routes.get('/changeStatus', categoryController.changeStatus);
routes.get('/editCategory', categoryController.editCategory);
routes.post('/updateCategory', categoryController.updateCategory);
routes.get('/deleteCategory', categoryController.deleteCategory);

module.exports = routes;