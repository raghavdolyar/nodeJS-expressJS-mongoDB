// external modules
const express = require('express');
const router = express.Router();

// local modules
const hostController = require('../controllers/host');
const { requireLogin, requireHost } = require('../middleware/guards');

router.get('/add-home', requireLogin, requireHost, hostController.getAddHome);
router.get(
	'/home-list',
	requireLogin,
	requireHost,
	hostController.getHostHomes,
);
router.get(
	'/edit-home/:homeId',
	requireLogin,
	requireHost,
	hostController.getEditHome,
);

router.post('/add-home', requireLogin, requireHost, hostController.postAddHome);
router.post(
	'/edit-home',
	requireLogin,
	requireHost,
	hostController.postEditHome,
);
router.post(
	'/delete-home/:homeId',
	requireLogin,
	requireHost,
	hostController.postDeleteHome,
);

module.exports = {
	hostRouter: router,
};
