const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const errorResponse = require('../utils/errResponse');
const User = require('../models/User');

//Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	// else if (req.cookies) {
	// 	token = req.cookies.token;
	// }

	//make sure tkoen exsiste
	if (!token) {
		return next(new errorResponse('Not authorized to access this route', 401));
	}

	try {
		//verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log(decoded);
		req.user = await User.findById(decoded.id);
		// console.log(req.user);
		next();
	} catch (err) {
		return next(new errorResponse('Not authorized to access this route', 401));
	}
});

exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new errorResponse(
					`User role ${req.user.role} is not authorized this route`,
					403
				)
			);
		}

		next();
	};
};
