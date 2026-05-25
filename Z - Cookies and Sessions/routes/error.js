// external modules
const express = require('express');
const router = express.Router();

// local modules
const errorController = require('../controllers/error');

router.use('/', errorController.pageNotFound);

module.exports = {
	errorRouter: router,
};
