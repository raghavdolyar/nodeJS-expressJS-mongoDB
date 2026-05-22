const db = require('../utils/database-util');

module.exports = class Favourite {
	static add(homeId) {
		return db.execute('INSERT IGNORE INTO favourites (home_id) VALUES (?)', [homeId]);
	}

	static remove(homeId) {
		return db.execute('DELETE FROM favourites WHERE home_id = ?', [homeId]);
	}

	static fetchAll() {
		return db.execute('SELECT * FROM favourites');
	}
};
