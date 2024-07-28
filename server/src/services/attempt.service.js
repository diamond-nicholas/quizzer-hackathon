const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const { Token, User, Quiz, Attempt } = require("../models");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/token");
const logger = require("../config/logger");

const startQuizAttempt = async (currentUser, quizId) => {
  const quiz = await Quiz.findById(quizId);

  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
  }

  if (currentUser === "tutor") {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Tutor can't attempt quiz");
  }

  if (!quiz.isPublished) {
    throw new ApiError(
      httpStatus.UNPROCESSABLE_ENTITY,
      "Quiz is not published"
    );
  }

  const attempt = await Attempt.create({
    user: currentUser._id,
    quiz: quizId,
    startTime: new Date(),
  });

  return attempt;
};

module.exports = {
  startQuizAttempt,
};
