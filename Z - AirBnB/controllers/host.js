const Home = require('../models/home');

exports.getAddHome = (req, res, next) => {
	res.render('host/add-home', {
		pageTitle: 'add home',
		currentPage: 'add-home',
	});
};

exports.getHostHomes = async (req, res, next) => {
	try {
		const regHomes = await Home.fetchAll();
		res.render('host/host-home-list', {
			homes: regHomes,
			pageTitle: 'host homes',
			currentPage: 'host-homes',
		});
	} catch (err) {
		next(err);
	}
};

exports.postAddHome = async (req, res, next) => {
	try {
		const { id, housename, location, price, rating, photoUrl } = req.body;
		const home = new Home(
			id.trim(),
			housename.trim(),
			location.trim(),
			price.trim(),
			rating.trim(),
			photoUrl.trim(),
		);

		await home.save();

		res.render('host/home-added', {
			pageTitle: 'thank you',
			currentPage: 'thank you',
		});
	} catch (err) {
		next(err);
	}
};
