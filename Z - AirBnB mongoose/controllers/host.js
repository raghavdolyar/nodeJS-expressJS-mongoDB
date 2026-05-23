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
			console.log('home not found in getEditHome()');
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
		const regHomes = await Home.find();
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
		const { housename, location, price, rating, photoUrl, description } =
			req.body;

		await Home.create({
			name: housename.trim(),
			location: location.trim(),
			price_per_night: parseFloat(price.trim()),
			rating: parseFloat(rating.trim()),
			photo_url: photoUrl.trim(),
			description: description.trim(),
		});

		res.redirect('/host/home-list');
	} catch (err) {
		next(err);
	}
};

exports.postEditHome = async (req, res, next) => {
	try {
		const { id, housename, location, price, rating, photoUrl, description } =
			req.body;

		const updated = await Home.findByIdAndUpdate(id, {
			name: housename.trim(),
			location: location.trim(),
			price_per_night: parseFloat(price.trim()),
			rating: parseFloat(rating.trim()),
			photo_url: photoUrl.trim(),
			description: description.trim(),
		});

		if (!updated) {
			console.log('home not found in postEditHome()');
		}

		res.redirect('/host/home-list');
	} catch (err) {
		next(err);
	}
};

exports.postDeleteHome = async (req, res, next) => {
	try {
		const deleted = await Home.findByIdAndDelete(req.params.homeId);

		if (!deleted) {
			console.log('home not found in postDeleteHome()');
		}

		res.redirect('/host/home-list');
	} catch (err) {
		next(err);
	}
};
