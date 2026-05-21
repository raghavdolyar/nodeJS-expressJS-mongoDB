const Home = require('../models/home');
const Favourite = require('../models/favourite');

exports.getIndex = (req, res, next) => {
  Home.fetchAll(regHomes => {
    res.render('store/index', {
      homes: regHomes,
      pageTitle: 'airbnb',
      currentPage: 'index',
    });
  });
};

exports.getHomes = (req, res, next) => {
  Home.fetchAll(regHomes => {
    res.render('store/user-home-list', {
      homes: regHomes,
      pageTitle: 'homes list',
      currentPage: 'homes',
    });
  });
};

exports.getBookings = (req, res, next) => {
  res.render('store/bookings', {
    pageTitle: 'my bookings',
    currentPage: 'bookings',
  });
};

exports.getFavouriteList = (req, res, next) => {
  Home.fetchAll(regHomes => {
    res.render('store/favourite-list', {
      homes: regHomes,
      pageTitle: 'my favourites',
      currentPage: 'favourites',
    });
  });
};

exports.postAddToFavourite = (req, res, next) => {
  console.log('came to add to favourites', req.body);
  Favourite.addToFavourite(req.body.id, err => {
    if (err) {
      console.log('error while marking favourites');
    }
    res.redirect('/favourites');
  });
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId, house => {
    if (!house) {
      console.log('home not found');
      res.redirect('/homes');
    } else {
      res.render('store/home-detail', {
        home: house,
        homeId: homeId,
        pageTitle: `home detail ${homeId}`,
        currentPage: 'homes',
      });
    }
  });
};
