// external modules
const express = require('express');
const router = express.Router();

// local modules
const storeController = require('../controllers/store');
const { requireLogin, requireGuest } = require('../middleware/guards');

// public routes
router.get('/', storeController.getIndex);
router.get('/homes', storeController.getHomes);

// logged in only
router.get('/homes/:homeId', requireLogin, storeController.getHomeDetails);

// gues only
router.get(
	'/bookings',
	requireLogin,
	requireGuest,
	storeController.getBookings,
);
router.get(
	'/favourites',
	requireLogin,
	requireGuest,
	storeController.getFavouriteList,
);
router.get(
	'/homes/:homeId/book',
	requireLogin,
	requireGuest,
	storeController.getBookHome,
);

router.post(
	'/favourites',
	requireLogin,
	requireGuest,
	storeController.postAddToFavourite,
);
router.post(
	'/favourites/delete/:homeId',
	requireLogin,
	requireGuest,
	storeController.postRemoveFromFavourite,
);
router.post(
	'/homes/:homeId/book',
	requireLogin,
	requireGuest,
	storeController.postBookHome,
);
router.post(
	'/bookings/delete/:bookingId',
	requireLogin,
	requireGuest,
	storeController.postDeleteBooking,
);

module.exports = {
	storeRouter: router,
};
