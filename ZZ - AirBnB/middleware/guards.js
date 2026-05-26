// Route guard middleware.

// Renders a 403 page if the user is not logged in.
exports.requireLogin = (req, res, next) => {
	if (!req.session.isLoggedIn) {
		return res.status(403).render('403', {
			pageTitle: '403 — Login Required',
			currentPage: '',
			title: 'Login Required',
			message:
				'You need to be logged in to access this page. Please log in or create an account to continue.',
			showLogin: true,
			showSignup: true,
		});
	}
	next();
};

// Renders a 403 page if the logged-in user is not a guest.
exports.requireGuest = (req, res, next) => {
	if (req.session.user?.user_type !== 'guest') {
		return res.status(403).render('403', {
			pageTitle: '403 — Guests Only',
			currentPage: '',
			title: 'Guests Only',
			message:
				"This page is only available to guest accounts. Host accounts don't have access to bookings or favourites.",
			showLogin: false,
			showSignup: false,
		});
	}
	next();
};

// Renders a 403 page if the logged-in user is not a host.
exports.requireHost = (req, res, next) => {
	if (req.session.user?.user_type !== 'host') {
		return res.status(403).render('403', {
			pageTitle: '403 — Hosts Only',
			currentPage: '',
			title: 'Hosts Only',
			message:
				'This area is reserved for host accounts only. You need a host account to manage listings.',
			showLogin: false,
			showSignup: false,
		});
	}
	next();
};
