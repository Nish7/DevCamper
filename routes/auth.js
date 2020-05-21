const express = require('express');
const {
	register,
	login,
	getMe,
	forgotpassword,
	resetPassword,
	updateDetails,
	updatePassword,
	logout,
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/getme', protect, getMe);
router.get('/logout', logout);

router.post('/register', register);
router.post('/forgotpassword', forgotpassword);
router.post('/login', login);

router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
