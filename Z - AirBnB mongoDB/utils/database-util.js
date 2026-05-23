const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const URL = process.env.MONGO_URL;

const client = new MongoClient(URL, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

let db = null;

async function connectDB() {
	try {
		await client.connect();
		await client.db('admin').command({ ping: 1 });
		db = client.db('airbnb');
		console.log('Successfully connected to MongoDB!');
	} catch (error) {
		console.error('Connection failed :', error);
		await client.close();
		throw error;
	}
}

function getDB() {
	if (!db) {
		throw new Error('Database not initialized. Call connectDB() first.');
	}
	return db;
}

module.exports = { connectDB, client, getDB };
