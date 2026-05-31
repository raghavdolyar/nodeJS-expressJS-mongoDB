const { default: mongoose } = require('mongoose');

const todoSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			required: [true, 'ID is required'],
			unique: true,
			trim: true,
		},
		text: { type: String, default: '', trim: true },
		completed: {
			type: Boolean,
			required: [true, 'completed field is required'],
			default: false,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Todo', todoSchema);
