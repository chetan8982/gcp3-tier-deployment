const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name required hai"],
      trim: true,
      maxlength: [100, "Name bahut bada hai"]
    },

    email: {
      type: String,
      required: [true, "Email required hai"],
      trim: true,
      lowercase: true,
      maxlength: [200, "Email bahut bada hai"],
      match: [
        /^\S+@\S+\.\S+$/,
        "Valid email enter karein"
      ]
    },

    message: {
      type: String,
      required: [true, "Message required hai"],
      trim: true,
      maxlength: [2000, "Message bahut bada hai"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Form", formSchema);