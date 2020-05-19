const User = require('../models/User');
const ErrorResponse = require('../utils/errResponse');
const asyncHandler = require('../middleware/async');

//@desc :       Register User
//@route :   POST /api/v1/auth/register
//@access:          Public
module.exports.register = asyncHandler(async (req, res, next) => {
	const { name, password, email, role } = req.body;

	const user = User.create({
		name,
		email,
		password,
		role,
	});

	res.status(200).json({ success: true });
});
