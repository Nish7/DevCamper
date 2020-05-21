const express = require('express');
const {
	GetBootcamps,
	GetBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	GetBootcampInRadius,
	bootcampPhotoUpload,
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

//Merge Bootcamp and Courses
const courses = require('./courses');
router.use('/:bootcampid/courses', courses);

router.route('/radius/:zipcode/:distance').get(GetBootcampInRadius);

router
	.route('/')
	.get(advancedResults(Bootcamp, 'courses'), GetBootcamps)
	.post(protect, authorize('publisher', 'admin'), createBootcamp);

router
	.route('/:id')
	.get(GetBootcamp)
	.put(protect, authorize('publisher', 'admin'), updateBootcamp)
	.delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router
	.route('/:id/photo')
	.put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

module.exports = router;
