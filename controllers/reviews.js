const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errResponse');
const asyncHandler = require('../middleware/async');

//@desc :       gets all reviews
//@route :      GET /api/v1/reviews
//@route :      GET /api/v1/bootcamps/:bootcampId/reviews
//@access:          PUBLIC
exports.getReviews = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampid) {
		const reviews = await Review.find({ bootcamp: req.params.bootcampid });
		return res.status(200).json({
			success: true,
			count: reviews.length,
			data: reviews,
		});
	} else {
		res.status(200).json(res.advancedResults);
	}
});

//@desc :       gets single reviews
//@route :      GET /api/v1/reviews/:reviewid
//@access:          PUBLIC
exports.getReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.reviewid).populate({
		path: 'bootcamp',
		select: 'name description',
	});

	if (!review) {
		return next(
			new ErrorResponse(
				`Review with the id ${req.params.reviewid} not found`,
				404
			)
		);
	}

	res.status(200).json({
		success: true,
		data: review,
	});
});

//@desc :       create a route
//@route :      POST /api/v1/bootcamps/:bootcampid/reviews
//@access:          Private
exports.addReview = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampid;
	req.body.user = req.user.id;

	const bootcamp = await Bootcamp.findById(req.params.bootcampid);

	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`No bootcamp with the id of ${req.params.bootcampid}`,
				404
			)
		);
	}

	const review = await Review.create(req.body);

	res.status(201).json({
		success: true,
		data: review,
	});
});

//@desc :       update a route
//@route :      PUT /api/v1/reviews/:reviewid
//@access:          Private
exports.updateReview = asyncHandler(async (req, res, next) => {
	let review = await Review.findById(req.params.reviewid);

	if (!review) {
		return next(
			new ErrorResponse(
				`No review with the id of ${req.params.bootcampid}`,
				404
			)
		);
	}

	if (req.user.id !== review.user.toString() && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(`User ${req.user.id} not authorized to update `, 401)
		);
	}

	review = await Review.findByIdAndUpdate(req.params.reviewid, req.body, {
		new: true,
		runValidator: true,
	});

	res.status(200).json({
		success: true,
		data: review,
	});
});

//@desc :       delete a route
//@route :      DELETE /api/v1/reviews/:reviewid
//@access:          Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
	let review = await Review.findById(req.params.reviewid);

	if (!review) {
		return next(
			new ErrorResponse(
				`No review with the id of ${req.params.bootcampid}`,
				404
			)
		);
	}

	if (req.user.id !== review.user.toString() && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(`User ${req.user.id} not authorized to update `, 401)
		);
	}

	await Review.remove();

	res.status(200).json({
		success: true,
		data: {},
	});
});
