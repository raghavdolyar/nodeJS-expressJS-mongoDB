const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path-util');

const favouriteDBPath = path.join(rootDir, 'database/favourite.json');

module.exports = class Favourite {
  static addToFavourite(id, callback) {
    this.getFavourites(favourites => {
      if (favourites.includes(id)) {
        console.log('home already in favourites');
      } else {
        favourites.push(id);
        fs.writeFile(favouriteDBPath, JSON.stringify(favourites), callback);
      }
    });
  }

  static getFavourites(callback) {
    fs.readFile(favouriteDBPath, (err, data) => {
      if (err) {
        console.log('Error reading homes DB:', err);
        return callback([]);
      }
      callback(data.length ? JSON.parse(data) : []);
    });
  }
};
