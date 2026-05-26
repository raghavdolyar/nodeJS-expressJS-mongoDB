// core modules
const path = require('path');

// external modules
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// database things
const { default: mongoose } = require('mongoose');
require('dotenv').config();
const DB_PATH = process.env.MONGO_URL;

// local modules
const { authRouter } = require('./routes/auth');
const { storeRouter } = require('./routes/store');
const { hostRouter } = require('./routes/host');
const { errorRouter } = require('./routes/error');
const { globalErrorHandler } = require('./controllers/error');
const rootDir = require('./utils/path-util');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// granting access to public folder
app.use(express.static(path.join(rootDir, 'public')));

const store = new MongoDBStore({ uri: DB_PATH, collection: 'sessions' });

// Handle MongoDBStore connection errors gracefully (it connects independently of mongoose)
store.on('error', async error => {
	const msg = error.message || String(error);
	const isIpWhitelistIssue =
		/whitelist|IP that isn't|SSL|tlsv1|alert internal error/i.test(msg);

	if (isIpWhitelistIssue) {
		console.error(
			'\nMongoDB session-store connection failed: your current IP is likely NOT on the Atlas IP Access List.',
		);

		try {
			const res = await fetch('https://api.ipify.org?format=json');
			const { ip } = await res.json();
			console.error(`Your current public IP appears to be: ${ip}`);
			console.error('Add this IP in Atlas if it is missing.\n');
		} catch {
			console.error(
				'Could not detect public IP. Check https://whatismyipaddress.com/ and add that IP in Atlas.\n',
			);
		}
	} else {
		console.error('MongoDB session-store error:', error);
	}

	mongoose.connection.close();
	process.exit(1);
});

app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		secret: 'airbnb secret',
		resave: false,
		saveUninitialized: true,
		store: store,
	}),
);

app.use(authRouter);

app.use(['/favourites', '/bookings', '/homes/:homeId'], (req, res, next) => {
	if (!req.session.isLoggedIn) return res.redirect('/login');
	next();
});
app.use(storeRouter);

app.use('/host', (req, res, next) => {
	if (!req.session.isLoggedIn) {
		return res.redirect('/login');
	}
	if (req.session.user?.user_type !== 'host') {
		return res.redirect('/');
	}
	next();
});
app.use('/host', hostRouter);

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
		const msg = err.message || String(err);
		const isIpWhitelistIssue =
			/whitelist|IP that isn't|SSL|tlsv1|alert internal error/i.test(msg);

		if (isIpWhitelistIssue) {
			console.error(
				'\nMongoDB connection failed: your current IP is likely NOT on the Atlas IP Access List.',
			);

			try {
				const res = await fetch('https://api.ipify.org?format=json');
				const { ip } = await res.json();
				console.error(`Your current public IP appears to be: ${ip}`);
				console.error('Add this IP in Atlas if it is missing.\n');
			} catch {
				console.error(
					'Could not detect public IP. Check https://whatismyipaddress.com/ and add that IP in Atlas.\n',
				);
			}
		} else {
			console.error('Server failed to start :', err);
		}

		mongoose.connection.close();
		process.exit(1);
	}
})();
