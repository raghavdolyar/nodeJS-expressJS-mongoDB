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
		const hostId = req.session.user._id;

		const house = await Home.findOne({ _id: homeId, host_id: hostId });

		if (!house) {
			console.log(
				'home not found or does not belong to this host in getEditHome()',
			);
			return res.redirect('/host/home-list');
		}

		res.render('host/edit-home', {
			home: house,
			pageTitle: 'edit home',
			currentPage: 'host-homes',
			editing,
		});
	} catch (err) {
		next(err);
	}
};

exports.getHostHomes = async (req, res, next) => {
	try {
		const hostId = req.session.user._id;
		const regHomes = await Home.find({ host_id: hostId });

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
		const { housename, location, price, rating, description } = req.body;
		const hostId = req.session.user._id;

		if (!req.file) {
			console.log('no image provided');
			return res.redirect('/');
		}

		const photo =
			req.body.photoUrl || (req.file ? `/uploads/${req.file.filename}` : '');

		await Home.create({
			name: housename.trim(),
			location: location.trim(),
			price_per_night: parseFloat(price.trim()),
			rating: parseFloat(rating.trim()),
			photo_url: photo.trim(),
			description: description.trim(),
			host_id: hostId,
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
		const hostId = req.session.user._id;

		// Only update if the home actually belongs to this host
		const updated = await Home.findOneAndUpdate(
			{ _id: id, host_id: hostId },
			{
				name: housename.trim(),
				location: location.trim(),
				price_per_night: parseFloat(price.trim()),
				rating: parseFloat(rating.trim()),
				photo_url: photoUrl.trim(),
				description: description.trim(),
			},
		);

		if (!updated) {
			console.log(
				'home not found or does not belong to this host in postEditHome()',
			);
		}

		res.redirect('/host/home-list');
	} catch (err) {
		next(err);
	}
};

exports.postDeleteHome = async (req, res, next) => {
	try {
		const hostId = req.session.user._id;

		// Only delete if the home belongs to this host
		const deleted = await Home.findOneAndDelete({
			_id: req.params.homeId,
			host_id: hostId,
		});

		if (!deleted) {
			console.log(
				'home not found or does not belong to this host in postDeleteHome()',
			);
		}

		res.redirect('/host/home-list');
	} catch (err) {
		next(err);
	}
};
