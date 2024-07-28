const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const questionSchema = mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  quiz: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Quiz",
    required: true,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
  image: {
    type: String,
    default: null,
  },
  isMultipleSelect: {
    type: Boolean,
    default: false,
  },
  allotedTime: {
    type: Number,
    required: true,
  },
  allotedMetric: {
    type: String,
    enum: ["hours", "minutes", "seconds"],
    default: "minutes",
  },
  marksAwarded: {
    type: Number,
    default: 0,
  },
});

questionSchema.plugin(toJSON);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
