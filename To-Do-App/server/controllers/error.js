exports.pageNotFound = (req, res, next) => {
	res.status(404).json({ message: 'page not found' });
};

exports.globalErrorHandler = (err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: 'some error occurred' });
};
