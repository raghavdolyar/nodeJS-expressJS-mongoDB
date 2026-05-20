const Home = require('../models/home');

exports.getAddHome = (req, res, next) => {
  res.render('host/add-home', {
    pageTitle: 'add home',
    currentPage: 'add-home',
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.fetchAll(regHomes => {
    res.render('host/host-home-list', {
      homes: regHomes,
      pageTitle: 'host homes',
      currentPage: 'host-homes',
    });
  });
};

exports.postAddHome = (req, res, next) => {
  const { id, housename, location, price, rating, photoUrl } = req.body;
  const home = new Home(
    id.trim(),
    housename.trim(),
    location.trim(),
    price.trim(),
    rating.trim(),
    photoUrl.trim(),
  );

  home.save(); // saving in DB

  res.render('host/home-added', {
    pageTitle: 'thank you',
    currentPage: 'thank you',
  });
};
