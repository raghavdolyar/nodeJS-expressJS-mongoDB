exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		pageTitle: 'login',
		currentPage: 'login',
		isLoggedIn: false,
	});
};

exports.postLogin = (req, res, next) => {
	res.cookie('isLoggedIn', true, {
		maxAge: 1000 * 60 * 60 * 24 * 30,
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
	});
	res.redirect('/');
};
