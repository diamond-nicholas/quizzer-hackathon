const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const { Token, User, Quiz, Question } = require("../models");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/token");
const logger = require("../config/logger");

const createQuestion = async (questionData, currentUser, file) => {
  console.log(currentUser);
  console.log(questionData);
  console.log(file);
  if (currentUser.role !== "tutor") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You dont have permission to do this"
    );
  }

  const quiz = await Quiz.findById(questionData.quizId);

  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
  }

  if (currentUser._id !== questionData.user) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Only quiz author can add questions"
    );
  }

  const question = await Question.create({
    questionText: questionData.questionText,
    quiz: questionData.quizId,
    user: questionData.userId,
    options: questionData.options,
    image: file || null,
    isMultipleSelect: questionData.isMultipleSelect,
    allotedTime: questionData.allotedTime,
    allotedMetric: questionData.allotedMetric,
  });

  return question;
};

module.exports = {
  createQuestion,
};
