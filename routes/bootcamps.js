const express = require("express");
const {
  GetBootcamps,
  GetBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  GetBootcampInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

const Bootcamp = require("../models/Bootcamp");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

//Merge Bootcamp and Courses
const courses = require("./courses");
router.use("/:bootcampid/courses", courses);

router.route("/radius/:zipcode/:distance").get(GetBootcampInRadius);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), GetBootcamps)
  .post(createBootcamp);

router
  .route("/:id")
  .get(GetBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route("/:id/photo").put(bootcampPhotoUpload);

module.exports = router;
