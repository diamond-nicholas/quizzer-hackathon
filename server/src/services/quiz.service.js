const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const { Token, User, Quiz } = require("../models");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/token");
const logger = require("../config/logger");

const createQuiz = async (quizData, currentUser) => {
  if (currentUser.role !== "tutor") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You dont have permission to do this"
    );
  }
  const quiz = await Quiz.create({
    title: quizData.title,
    user: currentUser._id,
    description: quizData.description,
  });

  return quiz;
};

const editQuiz = async (quizData, quizId, currentUser) => {
  if (currentUser.role !== "tutor") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You dont have permission to do this"
    );
  }
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
  }

  quiz.title = quizData.title;
  quiz.description = quizData.description;

  await quiz.save();
  return quiz;
};

const getOneQuiz = async (currentUser, quizId) => {
  const quiz = await Quiz.findById(quizId).populate("questions").exec();

  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
  }

  if (
    !quiz.isPublished &&
    quiz.user.toString() !== currentUser._id.toString()
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Quiz not published");
  }

  return quiz;
};

module.exports = {
  createQuiz,
  editQuiz,
  getOneQuiz,
};
