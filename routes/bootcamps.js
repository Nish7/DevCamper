const express = require('express');
const { GetBootcamps, GetBootcamp, createBootcamp, updateBootcamp, deleteBootcamp } = require('../controllers/bootcamps')

const router = express.Router();

router.route('/').get(GetBootcamps).post(createBootcamp);
router.route('/:id').get(GetBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;