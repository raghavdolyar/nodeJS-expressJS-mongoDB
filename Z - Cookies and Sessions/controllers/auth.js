exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		pageTitle: 'login',
		currentPage: 'login',
		isLoggedIn: req.session.isLoggedIn,
	});
};

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		pageTitle: 'signup',
		currentPage: 'signup',
		isLoggedIn: req.session.isLoggedIn,
	});
};

exports.postSignup = (req, res, next) => {
	res.redirect('/');
};

exports.postLogin = (req, res, next) => {
	req.session.isLoggedIn = true;
	res.redirect('/');
};

exports.postLogout = async (req, res, next) => {
	try {
		await new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
		res.clearCookie('connect.sid');
		res.redirect('/');
	} catch (err) {
		next(err);
	}
};
