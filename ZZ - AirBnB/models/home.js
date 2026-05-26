const { default: mongoose } = require('mongoose');

const homeSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		location: { type: String, required: true },
		price_per_night: { type: Number, required: true },
		rating: { type: Number, required: true, min: 0, max: 5 },
		photo_url: { type: String, default: '' },
		description: { type: String, default: '' },
		host_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Host',
			required: true,
		},
	},
	{ timestamps: true },
);

// when a home is deleted
// remove it from all guests' favourites
// and cancel all its bookings

homeSchema.pre('findOneAndDelete', async function () {
	const Booking = require('./booking');
	const Guest = require('./guest');
	const homeId = this.getFilter()._id;

	await Guest.updateMany(
		{ favourites: homeId },
		{ $pull: { favourites: homeId } },
	);
	await Booking.deleteMany({ home_id: homeId });
});

module.exports = mongoose.model('Home', homeSchema);
