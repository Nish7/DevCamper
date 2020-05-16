const slugify = require("slugify");
const mongoose = require("mongoose");
const geocoder = require("../utils/geocoder");

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "name cannot be more than 50 characters"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "please add a description"],
    maxlength: [500, "name cannot be more than 50 characters"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid URL with HTTP or HTTPS",
    ],
  },
  phone: {
    type: String,
    maxlength: [20, "phone cannot be longer than 20 characters"],
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "not valid email",
    ],
  },
  address: {
    type: String,
    required: [true, "please add an address"],
  },
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
      index: "2dsphere",
    },
    formattedAddress: String,
    state: String,
    city: String,
    country: String,
    zipcode: String,
    street: String,
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Other",
    ],
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must greater at least one"],
    max: [10, "Rating must be be under 10"],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpeg",
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Slugify
BootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Geocoder &  create location field
BootcampSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  //Do not save adderess
  this.address = undefined;
  next();
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
