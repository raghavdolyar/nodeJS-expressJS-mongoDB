const Home = require('../models/home');
const Favourite = require('../models/favourite');

exports.getIndex = async (req, res, next) => {
	try {
		const regHomes = await Home.find();
		const homes = regHomes.slice(0, 4);
		homes.sort((a, b) => b.rating - a.rating);

		res.render('store/index', {
			homes: homes,
			pageTitle: 'airbnb',
			currentPage: 'index',
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
		});
	} catch (err) {
		next(err);
	}
};

exports.getBookings = (req, res, next) => {
	res.render('store/bookings', {
		pageTitle: 'my bookings',
		currentPage: 'bookings',
	});
};

exports.getFavouriteList = async (req, res, next) => {
	try {
		const favourites = await Favourite.find().populate('home_id');
		const favouriteHomes = favourites.map(favourite => favourite.home_id);

		res.render('store/favourite-list', {
			homes: favouriteHomes,
			pageTitle: 'my favourites',
			currentPage: 'favourites',
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
		});
	} catch (err) {
		next(err);
	}
};

exports.postAddToFavourite = async (req, res, next) => {
	try {
		await Favourite.create({ home_id: req.body.homeId });
	} catch (err) {
		if (err.code !== 11000) {
			return next(err);
		}
		console.error('given home is already added to favourites');
	}
	res.redirect('/favourites');
};

exports.postRemoveFromFavourite = async (req, res, next) => {
	try {
		const deleted = await Favourite.findOneAndDelete({
			home_id: req.params.homeId,
		});

		if (!deleted) {
			console.log('home not found in postRemoveFromFavourite()');
		}

		res.redirect('/favourites');
	} catch (err) {
		next(err);
	}
};
