// external modules
const express = require('express');
const router = express.Router();

// local modules
const homesController = require('../controllers/store');

router.get('/', homesController.getIndex);
router.get('/homes', homesController.getHomes);
router.get('/bookings', homesController.getBookings);
router.get('/favourites', homesController.getFavouriteList);
router.get('/homes/:homeId', homesController.getHomeDetails);

module.exports = {
  storeRouter: router,
};
