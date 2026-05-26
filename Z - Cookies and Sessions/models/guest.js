const { default: mongoose } = require('mongoose');

const guestSchema = new mongoose.Schema(
	{
		first_name: { type: String, required: [true, 'First name is required'] },
		last_name: { type: String, default: '' },
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: { type: String, required: [true, 'Password is required'] },
		favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Home' }],
	},
	{ timestamps: true },
);

// when a guest is deleted
// also delete all their bookings

guestSchema.pre('findOneAndDelete', async function () {
	const Booking = require('./booking');
	const guestId = this.getFilter()._id;

	await Booking.deleteMany({ guest_id: guestId });
});

module.exports = mongoose.model('Guest', guestSchema);
