// external modules
const express = require('express');
const router = express.Router();

// local modules
const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

module.exports = {
	authRouter: router,
};
