const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const {
  authService,
  tokenService,
  userService,
  quizService,
  questionService,
  attemptService,
} = require("../services");
const pick = require("../utils/pick");
const Upload = require("../utils/cloudinaryConfig");

const startQuizAttempt = catchAsync(async (req, res) => {
  const result = await attemptService.startQuizAttempt(
    req.user,
    req.params.quizId
  );

  res.status(httpStatus.ACCEPTED).send({
    message: "",
    data: result,
  });
});

const recordQuestionAttempt = catchAsync(async (req, res) => {
  const result = await attemptService.recordQuestionAttempt(
    req.user,
    req.params.questionId,
    req.body
  );

  res.status(httpStatus.ACCEPTED).send({
    message: "",
    data: result,
  });
});

const getNextQuestion = catchAsync(async (req, res) => {
  const result = await attemptService.getNextQuestion(
    req.user,
    req.params.attemptId
  );

  res.status(httpStatus.ACCEPTED).send({
    message: "",
    data: result,
  });
});

const getPreviousQuestion = catchAsync(async (req, res) => {
  const result = await attemptService.getPrevQuestion(
    req.user,
    req.params.attemptId
  );

  res.status(httpStatus.ACCEPTED).send({
    message: "",
    data: result,
  });
});

const sumbitQuiz = catchAsync(async (req, res) => {
  const result = await attemptService.sumbitQuiz(
    req.user,
    req.params.attemptId
  );

  res.status(httpStatus.ACCEPTED).send({
    message: "",
    data: result,
  });
});

const getLeaderBoard = catchAsync(async (req, res) => {
  const result = await attemptService.getLeaderBoard(
    req.user,
    req.params.quizId
  );

  res.status(httpStatus.ACCEPTED).send({
    message: "",
    data: result,
  });
});

const getQuizHistory = catchAsync(async (req, res) => {
  const result = await attemptService.getQuizHistory(req.user);

  res.status(httpStatus.ACCEPTED).send({
    message: "",
    data: result,
  });
});

module.exports = {
  startQuizAttempt,
  recordQuestionAttempt,
  getNextQuestion,
  getPreviousQuestion,
  sumbitQuiz,
  getLeaderBoard,
  getQuizHistory,
};
