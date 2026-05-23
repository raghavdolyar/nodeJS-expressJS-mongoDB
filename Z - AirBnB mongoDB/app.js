// core modules
const path = require('path');

// external modules
const express = require('express');

// local modules
const { storeRouter } = require('./routes/storeRouter');
const { hostRouter } = require('./routes/hostRouter');
const { errorRouter } = require('./routes/errorRouter');
const { globalErrorHandler } = require('./controllers/errors');
const { connectDB } = require('./utils/database-util');
const rootDir = require('./utils/path-util');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// granting access to public folder
app.use(express.static(path.join(rootDir, 'public')));

app.use(express.urlencoded({ extended: true }));

app.use(storeRouter);
app.use('/host', hostRouter);
app.use(errorRouter);

app.use(globalErrorHandler);

const PORT = 3000;

(async () => {
	try {
		await connectDB();
		app.listen(PORT, () => {
			console.log(`Server running on address http://localhost:${PORT}`);
		});
	} catch (err) {
		console.error('Server failed to start :', err);
		process.exit(1);
	}
})();
