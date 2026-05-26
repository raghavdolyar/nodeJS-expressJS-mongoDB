const { default: mongoose } = require('mongoose');

const hostSchema = new mongoose.Schema(
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
		phone: { type: String, default: '' },
	},
	{ timestamps: true },
);

// when a host is deleted
// delete each of their homes one by one
// (using findOneAndDelete on each so that Home's own cascade hook fires too)

hostSchema.pre('findOneAndDelete', async function () {
	const Home = require('./home');
	const hostId = this.getFilter()._id;

	const homes = await Home.find({ host_id: hostId }, '_id');

	for (const home of homes) {
		await Home.findOneAndDelete({ _id: home._id });
	}
});

module.exports = mongoose.model('Host', hostSchema);
