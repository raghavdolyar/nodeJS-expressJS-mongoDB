const path = require('path');
const fs = require('fs');

const rootDir = require('../utils/path-util');

const RULES_DIR = path.join(rootDir, 'data', 'rules');

exports.downloadRules = (req, res, next) => {
	const filePath = path.join(RULES_DIR, 'Basic-House-Rules.pdf');

	if (!fs.existsSync(filePath)) {
		return res.status(404).render('404', {
			pageTitle: '404 — Rules Not Found',
			currentPage: '404',
		});
	}

	res.download(filePath, 'Basic-House-Rules.pdf');
};
