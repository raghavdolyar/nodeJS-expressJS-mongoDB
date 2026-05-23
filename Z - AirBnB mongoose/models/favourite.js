const { default: mongoose } = require('mongoose');

const favouriteSchema = mongoose.Schema({
	home_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Home',
		required: true,
		unique: true,
	},
});

module.exports = mongoose.model('Favourite', favouriteSchema);
