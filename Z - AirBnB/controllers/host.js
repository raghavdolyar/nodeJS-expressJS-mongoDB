const Home = require('../models/home');

exports.getAddHome = (req, res, next) => {
	res.render('host/edit-home', {
		pageTitle: 'add home',
		currentPage: 'add-home',
		editing: false,
	});
};

exports.getEditHome = async (req, res, next) => {
	try {
		const homeId = req.params.homeId;
		const editing = req.query.editing === 'true';
		const house = await Home.findById(homeId);

		if (!house) {
			return res.redirect('/host/home-list');
		}

		res.render('host/edit-home', {
			home: house,
			pageTitle: 'edit home',
			currentPage: 'host-homes',
			editing: editing,
		});
	} catch (err) {
		next(err);
	}
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
		const { housename, location, price, rating, photoUrl } = req.body;
		const home = new Home(
			housename.trim(),
			location.trim(),
			price.trim(),
			rating.trim(),
			photoUrl.trim(),
		);

		await home.save();

		res.redirect('/host/home-list');
	} catch (err) {
		next(err);
	}
};

exports.postEditHome = async (req, res, next) => {
	try {
		const { id, housename, location, price, rating, photoUrl } = req.body;
		const home = new Home(
			housename.trim(),
			location.trim(),
			price.trim(),
			rating.trim(),
			photoUrl.trim(),
		);

		home.id = id;
		await home.save();

		res.redirect('/host/home-list');
	} catch (err) {
		next(err);
	}
};
