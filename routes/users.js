const express = require('express');

const {
	getUsers,
	getUser,
	createUser,
	deleteUser,
	updateUser,
} = require('../controllers/users');

const User = require('../models/User');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(User), getUsers).post(createUser);
router.route('/:id').put(updateUser).get(getUser).delete(deleteUser);

module.exports = router;
