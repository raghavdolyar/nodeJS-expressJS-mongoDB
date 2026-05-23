const { getDB } = require('../utils/database-util');
const { ObjectId } = require('mongodb');

module.exports = class Favourite {
	static add(homeId) {
		const db = getDB();
		return db
			.collection('favourites')
			.updateOne(
				{ home_id: new ObjectId(homeId) },
				{ $setOnInsert: { home_id: new ObjectId(homeId) } },
				{ upsert: true },
			);
	}

	static remove(homeId) {
		const db = getDB();
		return db
			.collection('favourites')
			.deleteOne({ home_id: new ObjectId(homeId) });
	}

	static fetchAll() {
		const db = getDB();
		return db.collection('favourites').find().toArray();
	}
};
