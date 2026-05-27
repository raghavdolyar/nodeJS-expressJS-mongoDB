// external modules
const express = require('express');
const router = express.Router();

// local modules
const authController = require('../controllers/auth');
const { requireLogin } = require('../middleware/guards');

router.get('/signup', authController.getSignup);
router.get('/login', authController.getLogin);
router.get('/profile/edit', requireLogin, authController.getEditProfile);
router.get('/profile/delete', requireLogin, authController.getDeleteProfile);

router.post('/signup', authController.postSignup);
router.post('/login', authController.postLogin);
router.post('/logout', requireLogin, authController.postLogout);
router.post('/profile/edit', requireLogin, authController.postEditProfile);
router.post('/profile/delete', requireLogin, authController.postDeleteProfile);

module.exports = {
	authRouter: router,
};
