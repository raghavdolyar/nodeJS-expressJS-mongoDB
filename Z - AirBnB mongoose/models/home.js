const { default: mongoose } = require('mongoose');
const Favourite = require('./favourite');

const homeSchema = mongoose.Schema({
	name: { type: String, required: true },
	location: { type: String, required: true },
	price_per_night: { type: Number, required: true },
	rating: { type: Number, required: true },
	photo_url: String,
	description: String,
});

homeSchema.pre('findOneAndDelete', async function () {
	const homeId = this.getQuery()._id;
	await Favourite.findOneAndDelete({ home_id: homeId });
});

module.exports = mongoose.model('Home', homeSchema);
