const Home = require('../models/home');
const User = require('../models/user');

exports.getIndex = async (req, res, next) => {
	try {
		const regHomes = await Home.find();
		const homes = regHomes.slice(0, 4);
		homes.sort((a, b) => b.rating - a.rating);

		res.render('store/index', {
			homes: homes,
			pageTitle: 'airbnb',
			currentPage: 'index',
			isLoggedIn: req.session.isLoggedIn,
			user: req.session.user,
		});
	} catch (error) {
		next(error);
	}
};

exports.getHomes = async (req, res, next) => {
	try {
		const regHomes = await Home.find();
		res.render('store/user-home-list', {
			homes: regHomes,
			pageTitle: 'homes list',
			currentPage: 'homes',
			isLoggedIn: req.session.isLoggedIn,
			user: req.session.user,
		});
	} catch (err) {
		next(err);
	}
};

exports.getBookings = (req, res, next) => {
	res.render('store/bookings', {
		pageTitle: 'my bookings',
		currentPage: 'bookings',
		isLoggedIn: req.session.isLoggedIn,
		user: req.session.user,
	});
};

exports.getFavouriteList = async (req, res, next) => {
	try {
		const userId = req.session.user._id;
		const user = await User.findById(userId).populate('favourites');

		res.render('store/favourite-list', {
			homes: user.favourites,
			pageTitle: 'my favourites',
			currentPage: 'favourites',
			isLoggedIn: req.session.isLoggedIn,
			user: req.session.user,
		});
	} catch (err) {
		next(err);
	}
};

exports.getHomeDetails = async (req, res, next) => {
	try {
		const homeId = req.params.homeId;
		const house = await Home.findById(homeId);

		if (!house) {
			console.log('home not found in getHomeDetails()');
			return res.redirect('/homes');
		}

		res.render('store/home-detail', {
			home: house,
			homeId: homeId,
			pageTitle: `home detail ${homeId}`,
			currentPage: 'homes',
			isLoggedIn: req.session.isLoggedIn,
			user: req.session.user,
		});
	} catch (err) {
		next(err);
	}
};

exports.postAddToFavourite = async (req, res, next) => {
	try {
		const homeId = req.body.homeId;
		const userId = req.session.user._id;

		const updated = await User.findByIdAndUpdate(userId, {
			$addToSet: { favourites: homeId }, // $addToSet automatically ignores duplicates
		});

		if (!updated) {
			console.log('user not found!');
		}

		res.redirect('/favourites');
	} catch (err) {
		next(err);
	}
};

exports.postRemoveFromFavourite = async (req, res, next) => {
	try {
		const homeId = req.body.homeId;
		const userId = req.session.user._id;

		const deleted = await User.findByIdAndUpdate(userId, {
			$pull: { favourites: homeId },
		});

		if (!deleted) {
			console.log('user not found!');
		}

		res.redirect('/favourites');
	} catch (err) {
		next(err);
	}
};
