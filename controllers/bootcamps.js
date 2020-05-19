const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const ErrorResponse = require('../utils/errResponse');

//@desc :       Get all Bootcamps
//@route :   GET /api/v1/bootcamps
//@access:          Public
exports.GetBootcamps = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

//@desc :       get a bootcamp with ID
//@route :      GET /api/v1/bootcamps/:id
//@access:            Public
exports.GetBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`Bootcamp not found with the id of ${req.params.id}`,
				404
			)
		);
	}

	res.status(200).json({
		success: true,
		data: bootcamp,
	});
});

//@desc :       create a new bootcamp
//@route :      POST /api/v1/bootcamps
//@access:            Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body);

	res.status(201).json({
		success: true,
		data: bootcamp,
	});
});

//@desc :       update a bootcamp
//@route :      PUT /api/v1/bootcamps/:id
//@access:            Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!bootcamp)
		return next(
			new ErrorResponse(
				`Bootcamp not found with the id of ${req.params.id}`,
				404
			)
		);

	res.status(200).json({ success: true, data: bootcamp });
});

//@desc :       delete a bootcamp
//@route :      PUT /api/v1/bootcamps/:id
//@access:            Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp)
		return next(
			new ErrorResponse(
				`Bootcamp not found with the id of ${req.params.id}`,
				404
			)
		);

	bootcamp.remove();

	res.status(200).json({ success: true, data: {} });
});

//@desc :       gets a bootcamp within a radius
//@route :      GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access:            Private
exports.GetBootcampInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	//Lat and Long
	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	// clac rad
	const rad = distance / 3962;

	const bootcamps = await Bootcamp.find({
		location: { $geoWithin: { $centerSphere: [[lng, lat], rad] } },
	});

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	});
});

//@desc :       upload a photo for bootcamp
//@route :      PUT /api/v1/bootcamps/:id/photo
//@access:            Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp)
		return next(
			new ErrorResponse(
				`Bootcamp not found with the id of ${req.params.id}`,
				404
			)
		);

	if (!req.files) return next(new ErrorResponse(`file not found`, 400));

	const file = req.files.file;

	if (!file.mimetype.startsWith('image')) {
		return next(new ErrorResponse(`please upload an image file`, 400));
	}

	if (file.size < process.env.MAX_FILE_UPLOAD) {
		return next(
			new ErrorResponse(
				`please upload an image file less than ${process.env.MAX_FILE_UPLOAD}`,
				400
			)
		);
	}

	file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) {
			console.log(err);
			return next(new ErrorResponse(`Problem with file upload`, 500));
		}
	});

	await Bootcamp.findByIdAndUpdate(req.body.id, { photo: file.name });

	res.status(200).json({
		success: true,
		data: {
			photo: file.name,
		},
	});
});
