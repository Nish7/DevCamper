const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'please add an title'],
  },
  description: {
    type: String,
    required: [true, 'please add an description'],
  },
  weeks: {
    type: String,
    required: [true, 'please add an number of weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'please add an tuition cost'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'please add an min skill'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarshipsAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
});

// Static Methods
CourseSchema.statics.getAverageCost = async function (bootcampid) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampid },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);

  await this.model('Bootcamp').findByIdAndUpdate(bootcampid, {
    averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
  });
};

// call GetAvgCost after save
CourseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// call GetAvgCost before remove
CourseSchema.pre('remove', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
