exports.pageNotFound = (req, res, next) => {
	res.status(404).render('404', {
		pageTitle: '404 — Page Not Found',
		currentPage: '404',
		isLoggedIn: req.isLoggedIn,
	});
};

exports.globalErrorHandler = (err, req, res, next) => {
	console.error(err.stack);
	res.status(500).render('500', {
		pageTitle: '500 — Server Error',
		currentPage: '500',
		isLoggedIn: req.isLoggedIn,
	});
};
