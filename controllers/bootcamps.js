const Bootcamp = require("../models/Bootcamp");
const asyncMiddleware = require("../middleware/asyncMW");
const ErrorResponse = require("../utils/errResponse");

//@desc :       Get all Bootcamps
//@route :   GET /api/v1/bootcamps
//@access:          Public
exports.GetBootcamps = asyncMiddleware(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

//@desc :       get a bootcamp with ID
//@route :      GET /api/v1/bootcamps/:id
//@access:            Public
exports.GetBootcamp = asyncMiddleware(async (req, res, next) => {
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
exports.createBootcamp = asyncMiddleware(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

//@desc :       update a bootcamp
//@route :      PUT /api/v1/bootcamps/:id
//@access:            Private
exports.updateBootcamp = asyncMiddleware(async (req, res, next) => {
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
exports.deleteBootcamp = asyncMiddleware(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp)
    return next(
      new ErrorResponse(
        `Bootcamp not found with the id of ${req.params.id}`,
        404
      )
    );

  res.status(200).json({ success: true, data: {} });
});
