// core modules
const path = require('path');

// external modules
const express = require('express');

// local modules
const { authRouter } = require('./routes/authRouter');
const { storeRouter } = require('./routes/storeRouter');
const { hostRouter } = require('./routes/hostRouter');
const { errorRouter } = require('./routes/errorRouter');
const { globalErrorHandler } = require('./controllers/errors');
const rootDir = require('./utils/path-util');

const { default: mongoose } = require('mongoose');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// granting access to public folder
app.use(express.static(path.join(rootDir, 'public')));

app.use(express.urlencoded({ extended: true }));

app.use(authRouter);
app.use(storeRouter);
app.use('/host', hostRouter);
app.use(errorRouter);

app.use(globalErrorHandler);

const PORT = 3000;
const DB_PATH = process.env.MONGO_URL;

(async () => {
	try {
		await mongoose.connect(DB_PATH);
		console.log('Connected to MongoDB!');

		app.listen(PORT, () => {
			console.log(`Server running on address http://localhost:${PORT}`);
		});
	} catch (err) {
		const msg = err.message || String(err);
		const isIpWhitelistIssue = /whitelist|IP that isn't/i.test(msg);

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

		process.exit(1);
	}
})();
