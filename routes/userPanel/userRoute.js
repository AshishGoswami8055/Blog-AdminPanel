const express = require('express');
const routes = express.Router();
const userController = require('../../controller/userController/userController');

routes.get('/',userController.home);

routes.use("/admin", require('../../routes/adminPanel/adminRoute'));

module.exports = routes;