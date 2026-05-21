// external modules
const express = require('express');
const router = express.Router();

// local modules
const storeController = require('../controllers/store');

router.get('/', storeController.getIndex);
router.get('/homes', storeController.getHomes);
router.get('/bookings', storeController.getBookings);
router.get('/favourites', storeController.getFavouriteList);
router.get('/homes/:homeId', storeController.getHomeDetails);

router.post('/favourites', storeController.postAddToFavourite);

module.exports = {
  storeRouter: router,
};
