const mongoose = require("mongoose");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"]
  },
  imageUrl: {
    type: String,
    required: [true, "The image field is required"],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "you must provide a valid URL for this image",
    },
  },
  owner: {

  },
  likes: {

  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



module.exports = mongoose.model("item", clothingItemSchema);