// external modules
const express = require('express');
const router = express.Router();

// local modules
const hostController = require('../controllers/host');

router.get('/add-home', hostController.getAddHome);
router.get('/home-list', hostController.getHostHomes);
router.get('/edit-home/:homeId', hostController.getEditHome);

router.post('/add-home', hostController.postAddHome);
router.post('/edit-home', hostController.postEditHome);
router.post('/delete-home/:homeId', hostController.postDeleteHome);

module.exports = {
	hostRouter: router,
};
