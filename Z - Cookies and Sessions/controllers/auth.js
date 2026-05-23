exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		pageTitle: 'login',
		currentPage: 'login',
	});
};

exports.postLogin = (req, res, next) => {
	console.log(req.body);
	req.isLoggedIn = true;
	res.redirect('/');
};
