const { client, getDB } = require('../utils/database-util');
const { ObjectId } = require('mongodb');

module.exports = class Home {
	constructor(name, location, price, rating, photoUrl, description) {
		this.name = name;
		this.location = location;
		this.price_per_night = price;
		this.rating = rating;
		this.photo_url = photoUrl;
		this.description = description;
	}

	save() {
		const db = getDB();
		return db.collection('homes').insertOne(this);
	}

	update(homeId) {
		const db = getDB();
		return db
			.collection('homes')
			.updateOne({ _id: new ObjectId(homeId) }, { $set: this });
	}

	static fetchAll() {
		const db = getDB();
		return db.collection('homes').find().toArray();
	}

	static find(homeId) {
		const db = getDB();
		return db
			.collection('homes')
			.find({ _id: new ObjectId(homeId) })
			.next();
	}

	static async delete(homeId) {
		const db = getDB();
		const session = client.startSession();
		try {
			await session.withTransaction(async () => {
				await db
					.collection('homes')
					.deleteOne({ _id: new ObjectId(homeId) }, { session });
				await db
					.collection('favourites')
					.deleteOne({ home_id: new ObjectId(homeId) }, { session });
			});
		} finally {
			await session.endSession();
		}
	}
};
