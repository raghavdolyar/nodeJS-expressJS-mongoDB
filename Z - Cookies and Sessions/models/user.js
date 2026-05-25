const { default: mongoose } = require('mongoose');

const userSchema = mongoose.Schema(
	{
		first_name: { type: String, required: [true, 'first name is required'] },
		last_name: String,
		email: {
			type: String,
			required: [true, 'email is required'],
			unique: true,
		},
		password: { type: String, required: [true, 'password is required'] },
		user_type: { type: String, enum: ['guest', 'host'], default: 'guest' },
		favourites: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Home',
			},
		],
	},
	{ timestamps: true },
);

module.exports = mongoose.model('user', userSchema);
