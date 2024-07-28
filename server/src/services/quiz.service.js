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
    passMark: quizData.passMark,
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
  quiz.quizData = quizData.quizData;

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

const getAllQuiz = async (currentUser) => {
  const quizes = await Quiz.find({});

  const visibleQuizForStudents = quizes.filter((quiz) => quiz.isPublished);

  const visibleQuizForTutor = quizes.filter((quiz) => {
    return (
      quiz.isPublished || quiz.user.toString() === currentUser._id.toString()
    );
  });

  if (currentUser.role !== "tutor") {
    return visibleQuizForStudents;
  } else {
    return visibleQuizForTutor;
  }
};

const publishQuiz = async (currentUser, quizId) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
  }

  if (currentUser.role !== "tutor") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Only tutor can publish a quiz"
    );
  }

  if (currentUser._id.toString() !== quiz.user.toString()) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Only creator can publish quiz"
    );
  }

  quiz.isPublished = true;

  const totalTimeAllowedInMinutes = quiz.totalTimeAllowed / 60 + " minutes";

  const response = {
    _id: quiz._id,
    title: quiz.title,
    user: quiz.user,
    totalTimeAllowed: totalTimeAllowedInMinutes,
    totalQuestions: quiz.totalQuestions,
    isPublished: quiz.isPublished,
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt,
    __v: quiz.__v,
    id: quiz.id,
  };
  await quiz.save();
  return response;
};

module.exports = {
  createQuiz,
  editQuiz,
  getOneQuiz,
  getAllQuiz,
  publishQuiz,
};
