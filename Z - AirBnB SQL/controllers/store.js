const Home = require('../models/home');
const Favourite = require('../models/favourite');

exports.getIndex = async (req, res, next) => {
	try {
		const [regHomes] = await Home.fetchAll();
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
		const [regHomes] = await Home.fetchAll();
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
		const [[regHomes], [favourites]] = await Promise.all([
			Home.fetchAll(),
			Favourite.fetchAll(),
		]);

		const favouriteIds = favourites.map(favourite => favourite.home_id);
		const favouriteSet = new Set(favouriteIds);
		const favouriteHomes = regHomes.filter(home => favouriteSet.has(home.id));

		res.render('store/favourite-list', {
			homes: favouriteHomes,
			pageTitle: 'my favourites',
			currentPage: 'favourites',
		});
	} catch (err) {
		next(err);
	}
};

exports.postAddToFavourite = async (req, res, next) => {
	try {
		await Favourite.add(req.body.homeId);
		res.redirect('/favourites');
	} catch (err) {
		next(err);
	}
};

exports.postRemoveFromFavourite = async (req, res, next) => {
	try {
		await Favourite.remove(req.params.homeId);
		res.redirect('/favourites');
	} catch (err) {
		next(err);
	}
};

exports.getHomeDetails = async (req, res, next) => {
	try {
		const homeId = req.params.homeId;
		const [homes] = await Home.findById(homeId);
		const house = homes[0];

		if (!house) {
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
