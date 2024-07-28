const mongoose = require("mongoose");

const quizSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
    },
    totalTimeAllowed: {
      type: Number, // in secs
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

quizSchema.virtual("questions", {
  ref: "Question",
  localField: "_id",
  foreignField: "quiz",
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
