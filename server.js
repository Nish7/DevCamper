const path = require('path');
const express = require('express');
// const morgan = require('morgan');
const dotenv = require('dotenv');
// const colors = require('colors');
const fileupload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const helmet = require('helmet');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDb = require('./config/db.js');

//Env invocation
dotenv.config({ path: './config/config.env' });

// connect DB
connectDb();

//Route Files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

//Morgan : Req Logger
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

//Body Parser
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

//File upload
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 mins
	max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

//error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
	console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// process.on('unhandledRejection', (err, promise) => {
// 	console.log(`Error: ${err.message}`);
// 	server.close(() => process.exit(1));
// });
