const ErrorResponse = require('../utils/errResponse');

const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;

	console.log(err);

	//CastError --> Bad ObjectId
	if (err.name === 'CastError') {
		const message = `Resource not found`;
		error = new ErrorResponse(message, 404);
	}

	//DuplicationError
	if (err.code === 11000) {
		const message = 'Duplicate field value entered';
		error = new ErrorResponse(message, 400);
	}

	//ValidationError
	if (err.name === 'ValidationError') {
		const message = Object.values(err.errors).map((val) => val.message);
		console.log(message);
		error = new ErrorResponse(message, 400);
	}

	//Response
	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'Server Error',
	});
};

module.exports = errorHandler;
