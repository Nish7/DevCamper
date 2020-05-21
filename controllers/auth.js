const User = require('../models/User');
const crypto = require('crypto');
const ErrorResponse = require('../utils/errResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');

//@desc :       Register User
//@route :   POST /api/v1/auth/register
//@access:          Public
exports.register = asyncHandler(async (req, res, next) => {
	const { name, password, email, role } = req.body;

	const user = await User.create({
		name,
		email,
		password,
		role,
	});

	sendTokenResponse(user, 200, res);
});

//@desc :       Login User
//@route :   POST /api/v1/auth/login
//@access:          Public
exports.login = asyncHandler(async (req, res, next) => {
	const { password, email } = req.body;

	//email and password validation
	if (!password || !email) {
		return next(new ErrorResponse('Please provide an email and password', 400));
	}

	//check user
	const user = await User.findOne({ email }).select('+password');

	if (!user) {
		return next(new ErrorResponse(`Invalid creditials`, 401));
	}

	const isMatch = await user.matchPasswords(password);

	if (!isMatch) {
		return next(new ErrorResponse(`Invalid creditials`, 401));
	}

	sendTokenResponse(user, 200, res);
});

//@desc :       Logout
//@route :   GET /api/v1/auth/logot
//@access:          Private
exports.logout = asyncHandler(async (req, res, next) => {
	res.cookie('token', 'none', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	// res.clearCookie('token');

	res.status(200).json({
		success: true,
		data: {},
	});
});

//@desc :       Current Logged in user
//@route :   GETs /api/v1/auth/me
//@access:          Private
exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id);
	res.status(200).json({
		success: true,
		data: user,
	});
});

//@desc :       Update user details
//@route :   PUT /api/v1/auth/updatedetails
//@access:          Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
	const fieldToUpdate = {
		name: req.body.name,
		email: req.body.email,
	};

	const user = await User.findByIdAndUpdate(req.user.id, fieldToUpdate, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: user,
	});
});

//@desc :       Update user password
//@route :   PUT /api/v1/auth/updatepassword
//@access:          Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password');

	console.log(user);

	if (!(await user.matchPasswords(req.body.currentPassword))) {
		return next(new ErrorResponse('Password incorrect', 401));
	}

	user.password = req.body.newPassword;
	await user.save();

	sendTokenResponse(user, 200, res);
});

//@desc :	Send a forgot password token
//@route :   POST /api/v1/auth/forgotpassword
//@access:          Public
exports.forgotpassword = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(
			new ErrorResponse(`there is not username with that email`, 401)
		);
	}

	const resetToken = user.getResetPasswordToken();

	await user.save({
		validateBeforeSave: false,
	});

	//Create reset url
	const resetUrl = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/auth/resetpassword/${resetToken}`;
	const message = `please make PUT request to ${resetUrl}`;

	try {
		await sendEmail({
			email: user.email,
			subject: 'Reset Password Token',
			message,
		});

		res.status(200).json({
			success: true,
			data: 'Email sent!',
		});
	} catch (err) {
		console.log(err);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new ErrorResponse(`Email could not be send, try again`, 500));
	}
});

//@desc :       Reset Password from fogotten password
//@route :   PUT /api/v1/auth/resetpassword/:resettoken
//@access:          Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
	console.log(req.params.resettoken);

	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.resettoken)
		.digest('hex');

	console.log(resetPasswordToken);

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) return next(new ErrorResponse('Invalid token', 400));

	// Set new password
	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;

	await user.save();

	sendTokenResponse(user, 200, res);
});

const sendTokenResponse = (user, statusCode, res) => {
	const token = user.getSignedJwtToken();

	const options = {
		expires: new Date(
			Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') {
		options.secure = true;
	}

	res
		.status(statusCode)
		.cookie('token', token, options)
		.json({ success: true, token });
};
