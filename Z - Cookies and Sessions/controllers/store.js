const Home = require('../models/home');
const Guest = require('../models/guest');
const Booking = require('../models/booking');
const mongoose = require('mongoose');

exports.getIndex = async (req, res, next) => {
	try {
		const regHomes = await Home.find();
		regHomes.sort((a, b) => b.rating - a.rating);
		const homes = regHomes.slice(0, 6);

		res.render('store/index', {
			homes,
			pageTitle: 'airbnb',
			currentPage: 'index',
		});
	} catch (err) {
		next(err);
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

exports.getBookings = async (req, res, next) => {
	try {
		const guestId = req.session.user._id;

		// Populate home_id so the view has full home details
		const bookings = await Booking.find({ guest_id: guestId }).populate(
			'home_id',
		);

		res.render('store/bookings', {
			bookings,
			pageTitle: 'my bookings',
			currentPage: 'bookings',
		});
	} catch (err) {
		next(err);
	}
};

exports.getFavouriteList = async (req, res, next) => {
	try {
		const guestId = req.session.user._id;
		const guest = await Guest.findById(guestId).populate('favourites');

		res.render('store/favourite-list', {
			homes: guest.favourites,
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
			homeId,
			pageTitle: `home detail ${homeId}`,
			currentPage: 'homes',
		});
	} catch (err) {
		next(err);
	}
};

exports.postAddToFavourite = async (req, res, next) => {
	try {
		const homeId = req.body.homeId;
		if (!mongoose.isValidObjectId(homeId)) {
			console.log('invalid homeId in postAddToFavourite()');
			return res.redirect('/homes');
		}
		const guestId = req.session.user._id;

		const updated = await Guest.findByIdAndUpdate(guestId, {
			$addToSet: { favourites: homeId },
		});

		if (!updated) {
			console.log('guest not found in postAddToFavourite()');
		}

		res.redirect('/favourites');
	} catch (err) {
		next(err);
	}
};

exports.postRemoveFromFavourite = async (req, res, next) => {
	try {
		const homeId = req.params.homeId;
		const guestId = req.session.user._id;

		const updated = await Guest.findByIdAndUpdate(guestId, {
			$pull: { favourites: homeId },
		});

		if (!updated) {
			console.log('guest not found in postRemoveFromFavourite()');
		}

		res.redirect('/favourites');
	} catch (err) {
		next(err);
	}
};

exports.getBookHome = async (req, res, next) => {
	try {
		const homeId = req.params.homeId;
		const home = await Home.findById(homeId);

		if (!home) {
			console.log('home not found in getBookHome()');
			return res.redirect('/homes');
		}

		res.render('store/book-home', {
			home,
			homeId,
			pageTitle: `Book ${home.name}`,
			currentPage: 'homes',
			oldInput: {},
			validationErrors: [],
		});
	} catch (err) {
		next(err);
	}
};

exports.postBookHome = async (req, res, next) => {
	try {
		const homeId = req.params.homeId;
		const guestId = req.session.user._id;
		const { checkIn, checkOut, totalPrice } = req.body;

		const errors = [];

		const inDate = new Date(checkIn);
		const outDate = new Date(checkOut);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		if (!checkIn)
			errors.push({ path: 'checkIn', msg: 'Check-in date is required.' });
		else if (inDate < today)
			errors.push({
				path: 'checkIn',
				msg: 'Check-in date cannot be in the past.',
			});

		if (!checkOut)
			errors.push({ path: 'checkOut', msg: 'Check-out date is required.' });
		else if (outDate <= inDate)
			errors.push({
				path: 'checkOut',
				msg: 'Check-out must be after check-in.',
			});

		if (errors.length > 0) {
			const home = await Home.findById(homeId);
			return res.status(422).render('store/book-home', {
				home,
				homeId,
				pageTitle: `Book ${home.name}`,
				currentPage: 'homes',
				oldInput: { checkIn, checkOut, totalPrice },
				validationErrors: errors,
			});
		}

		// ── Compute total price server-side (don't trust the client value) ──
		const home = await Home.findById(homeId);
		if (!home) {
			console.log('home not found in postBookHome()');
			return res.redirect('/homes');
		}
		const nights = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));
		const total = parseFloat((nights * home.price_per_night).toFixed(2));

		await Booking.create({
			guest_id: guestId,
			home_id: homeId,
			check_in: inDate,
			check_out: outDate,
			total_price: total,
			status: 'pending',
		});

		res.redirect('/bookings');
	} catch (err) {
		next(err);
	}
};

exports.postDeleteBooking = async (req, res, next) => {
	try {
		const bookingId = req.params.bookingId;
		const guestId = req.session.user._id;

		await Booking.findOneAndDelete({ _id: bookingId, guest_id: guestId });
		res.redirect('/bookings');
	} catch (err) {
		next(err);
	}
};
