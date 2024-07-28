const mongoose = require("mongoose");

const attemptedQuestionSchema = mongoose.Schema({
  attemptedQuizId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Attempt",
    required: true,
  },
  questionId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Question",
    required: true,
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  selectedOptions: [
    {
      type: String,
      required: true,
    },
  ],
  isCorrect: {
    type: Boolean,
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
  duration: {
    type: Number,
    default: 0,
  },
  isAttempted: {
    type: Boolean,
    default: false,
  },
});

const AttemptedQuestion = mongoose.model(
  "AttemptedQuestion",
  attemptedQuestionSchema
);

module.exports = AttemptedQuestion;
