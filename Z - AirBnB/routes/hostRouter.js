// external modules
const express = require('express');
const router = express.Router();

// local modules
const homesController = require('../controllers/host');

router.get('/add-home', homesController.getAddHome);
router.get('/home-list', homesController.getHostHomes);

router.post('/add-home', homesController.postAddHome);

module.exports = {
	hostRouter: router,
};
