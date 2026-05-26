exports.randomString = (length = 10) => {
	const chars = 'abcdefghijklmnopqrstuvwxyz';
	return Array.from(
		{ length },
		() => chars[Math.floor(Math.random() * chars.length)],
	).join('');
};
