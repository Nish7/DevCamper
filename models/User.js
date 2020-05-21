const mongoose = require('mongoose');
const crypto = require('crypto');
const bcyrpt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'please add an name'],
	},
	email: {
		type: String,
		match: [
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			'please add an valid email',
		],
		required: [true, 'Please add an email'],
		unique: true,
	},
	role: {
		type: String,
		enum: ['user', 'publisher'],
		default: 'user',
	},
	password: {
		type: String,
		required: [true, 'please add an password'],
		minlength: 6,
		select: false,
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,

	createdDate: {
		type: Date,
		default: Date.now,
	},
});

//Sign JWT Token
UserSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

//Password check from db
UserSchema.methods.matchPasswords = async function (enteredPassword) {
	return await bcyrpt.compare(enteredPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
	const resetToken = crypto.randomBytes(20).toString('hex');

	console.log(resetToken);

	//Hash it
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	// expire

	console.log(this.resetPasswordToken);

	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
	return resetToken;
};

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	const salt = await bcyrpt.genSalt(10);
	this.password = await bcyrpt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);
