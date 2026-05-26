const { default: mongoose } = require('mongoose');

const bookingSchema = new mongoose.Schema(
	{
		guest_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Guest',
			required: true,
		},
		home_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Home',
			required: true,
		},
		check_in: { type: Date, required: true },
		check_out: { type: Date, required: true },
		total_price: { type: Number, required: true },
		status: {
			type: String,
			enum: ['pending', 'confirmed', 'cancelled'],
			default: 'pending',
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Booking', bookingSchema);
