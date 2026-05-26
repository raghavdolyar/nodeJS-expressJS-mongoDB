// core modules
const path = require('path');
const fs = require('fs');

// external modules
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const MongoDBStore = require('connect-mongodb-session')(session);

// database things
const { default: mongoose } = require('mongoose');
require('dotenv').config();
const DB_PATH = process.env.MONGO_URL;

// local modules
const { authRouter } = require('./routes/auth');
const { storeRouter } = require('./routes/store');
const { hostRouter } = require('./routes/host');
const { rulesRouter } = require('./routes/rules');
const { errorRouter } = require('./routes/error');
const { globalErrorHandler } = require('./controllers/error');
const rootDir = require('./utils/path-util');
const { randomString } = require('./utils/random-string');

const app = express();

const store = new MongoDBStore({ uri: DB_PATH, collection: 'sessions' });

app.use(
	session({
		secret: 'airbnb secret',
		resave: false,
		saveUninitialized: false,
		store: store,
		cookie: {
			httpOnly: true,
			sameSite: 'lax',
		},
	}),
);

app.use((req, res, next) => {
	res.locals.isLoggedIn = req.session.isLoggedIn || false;
	res.locals.user = req.session.user || {};
	next();
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(rootDir, 'public'))); // granting access to public folder

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

fs.mkdirSync(path.join(rootDir, 'public', 'uploads'), { recursive: true }); // ensure uploads directory exists

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, randomString(10) + '-' + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	if (['image/jpeg', 'images/jpg', 'image/png'].includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.use(multer({ storage, fileFilter }).single('photoFile')); // since field name in edit-home.ejs is photo

app.use(authRouter);
app.use(storeRouter);
app.use('/host', hostRouter);
app.use(rulesRouter);

app.use(errorRouter);
app.use(globalErrorHandler);

const PORT = 3000;

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
