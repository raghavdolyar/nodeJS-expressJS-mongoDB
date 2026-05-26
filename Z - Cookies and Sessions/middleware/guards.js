/**
 * Route guard middleware.
 * Apply these per-route in router files for fine-grained access control.
 */

/**
 * Redirects to /login if the user is not logged in.
 */
exports.requireLogin = (req, res, next) => {
	if (!req.session.isLoggedIn) {
		return res.redirect('/login');
	}
	next();
};

/**
 * Redirects to / if the logged-in user is not a guest.
 * Must be used AFTER requireLogin.
 */
exports.requireGuest = (req, res, next) => {
	if (req.session.user?.user_type !== 'guest') {
		return res.redirect('/');
	}
	next();
};

/**
 * Redirects to / if the logged-in user is not a host.
 * Must be used AFTER requireLogin.
 */
exports.requireHost = (req, res, next) => {
	if (req.session.user?.user_type !== 'host') {
		return res.redirect('/');
	}
	next();
};
