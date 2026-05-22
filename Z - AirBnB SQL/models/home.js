const db = require('../utils/database-util');
const Favourite = require('./favourite');

module.exports = class Home {
	constructor(id, name, location, price, rating, photoUrl, description) {
		this.id = id;
		this.name = name;
		this.location = location;
		this.price_per_night = price;
		this.rating = rating;
		this.photo_url = photoUrl;
		this.description = description;
	}

	save() {
		if (this.id) {
			return db.execute(
				'UPDATE homes SET `name` = ?, price_per_night = ?, location = ?, rating = ?, `description` = ?, photo_url = ? WHERE id = ?',
				[
					this.name,
					this.price_per_night,
					this.location,
					this.rating,
					this.description,
					this.photo_url,
					this.id,
				],
			);
		} else {
			return db.execute(
				'INSERT INTO homes (`name`,  price_per_night, location, rating, `description`, photo_url) VALUES (?, ?, ?, ?, ?, ?)',
				[
					this.name,
					this.price_per_night,
					this.location,
					this.rating,
					this.description,
					this.photo_url,
				],
			);
		}
	}

	static fetchAll() {
		return db.execute('SELECT * FROM homes');
	}

	static findById(homeId) {
		return db.execute('SELECT * FROM homes WHERE id = ?', [homeId]);
	}

	static deleteById(homeId) {
		// works due to DB cascade (removes from Favourites)
		return db.execute('DELETE FROM homes WHERE id = ?', [homeId]);
	}
};
