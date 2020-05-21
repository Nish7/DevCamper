const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, 'please add a title for the review'],
		maxlength: 100,
	},
	text: {
		type: String,
		required: [true, 'please add some text'],
	},
	rating: {
		type: Number,
		min: 1,
		max: 10,
		required: [true, 'please add a rating between 1 and 10'],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	bootcamp: {
		type: mongoose.Schema.ObjectId,
		ref: 'Bootcamp',
		required: true,
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},
});

ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static Methods to avg rating
ReviewSchema.statics.getAverageRating = async function (bootcampid) {
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampid },
		},
		{
			$group: {
				_id: '$bootcamp',
				averageRating: { $avg: '$rating' },
			},
		},
	]);

	try {
		await this.model('Bootcamp').findByIdAndUpdate(bootcampid, {
			averageRating: obj[0].averageRating,
		});
	} catch (err) {
		console.error(err);
	}
};

// call GetAvgCost after save
ReviewSchema.post('save', async function () {
	await this.constructor.getAverageRating(this.bootcamp);
});

// call GetAvgCost before remove
ReviewSchema.pre('remove', async function () {
	await this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);
