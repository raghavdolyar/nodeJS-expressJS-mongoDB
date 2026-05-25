const { default: mongoose } = require('mongoose');
const User = require('./user');

const homeSchema = mongoose.Schema(
	{
		name: { type: String, required: true },
		location: { type: String, required: true },
		price_per_night: { type: Number, required: true },
		rating: { type: Number, required: true },
		photo_url: String,
		description: String,
	},
	{ timestamps: true },
);

homeSchema.pre('findOneAndDelete', async function () {
	const homeId = this.getFilter()._id;
	await User.updateMany(
		{ favourites: homeId },
		{ $pull: { favourites: homeId } },
	);
});

module.exports = mongoose.model('Home', homeSchema);
