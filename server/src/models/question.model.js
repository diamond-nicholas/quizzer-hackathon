const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const questionSchema = mongoose.Schema(
  {
    questionText: {
      type: String,
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
    },
    isMultipleSelect: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number, //in secs
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

tokenSchema.plugin(toJSON);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
