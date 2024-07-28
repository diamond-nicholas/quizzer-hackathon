const mongoose = require("mongoose");

const attemptSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    quiz: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Quiz",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    totalCorrectMarks: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Attempt = mongoose.model("Attempt", attemptSchema);

module.exports = Attempt;
