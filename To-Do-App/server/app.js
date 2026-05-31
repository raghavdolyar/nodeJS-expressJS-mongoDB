require('dotenv').config({ path: require('path').resolve(__dirname, '.env') }); // load env variables first

// external modules
const express = require('express');
const cors = require('cors');

// database modules
const { default: mongoose } = require('mongoose');
const DB_PATH = `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@ac-6x8zp7e-shard-00-00.sfq9v7c.mongodb.net:27017,ac-6x8zp7e-shard-00-01.sfq9v7c.mongodb.net:27017,ac-6x8zp7e-shard-00-02.sfq9v7c.mongodb.net:27017/${process.env.MONGO_DB_DATABASE}?ssl=true&replicaSet=atlas-117l3c-shard-0&authSource=admin&appName=Cluster0`;

// local modules
const errorController = require('./controllers/error');
const { todoRouter } = require('./routers/todo');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use('/todos', todoRouter);

app.use(errorController.pageNotFound);
app.use(errorController.globalErrorHandler);

const PORT = process.env.PORT || 3000;

(async () => {
	try {
		await mongoose.connect(DB_PATH);
		console.log('Connected to MongoDB!');

		app.listen(PORT, () => {
			console.log(`Server running on address http://localhost:${PORT}`);
		});
	} catch (err) {
		console.error('Server failed to start :', err);
		mongoose.connection.close();
		process.exit(1);
	}
})();
