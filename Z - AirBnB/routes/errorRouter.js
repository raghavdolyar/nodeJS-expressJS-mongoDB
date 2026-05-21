// external modules
const express = require('express');
const router = express.Router();

// local modules
const errorsController = require('../controllers/errors');

router.use('/', errorsController.pageNotFound);
router.use('/', errorsController.globalErrorHandler);

module.exports = {
	notFoundRouter: router,
};
