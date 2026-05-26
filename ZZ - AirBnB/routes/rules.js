const express = require('express');
const router = express.Router();

const rulesController = require('../controllers/rules');
const { requireLogin } = require('../middleware/guards');

router.get('/rules', requireLogin, rulesController.downloadRules);

module.exports = { rulesRouter: router };
