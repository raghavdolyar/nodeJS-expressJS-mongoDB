const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path-util');

const homeDBPath = path.join(rootDir, 'database/homes.json');

module.exports = class Home {
  constructor(id, name, location, price, rating, photoUrl) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.price = price;
    this.rating = rating;
    this.photoUrl = photoUrl;
  }

  save() {
    Home.fetchAll(homes => {
      homes.push(this);
      fs.writeFile(homeDBPath, JSON.stringify(homes), err => {
        console.error(err);
      });
    });
  }

  static fetchAll(callback) {
    fs.readFile(homeDBPath, (err, data) => {
      if (err) {
        console.log('Error reading homes DB:', err);
        return callback([]);
      }
      callback(data.length ? JSON.parse(data) : []);
    });
  }

  static findById(homeId, callback) {
    this.fetchAll(homes => {
      const homeFound = homes.find(home => home.id === homeId);
      callback(homeFound);
    });
  }
};
