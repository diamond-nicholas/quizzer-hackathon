const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const { Token, User, Quiz, Attempt, Question } = require("../models");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/token");
const logger = require("../config/logger");
const AttemptedQuestion = require("../models/attemptQuestion.model");

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

const recordQuestionAttempt = async (currentUser, questionId, questionData) => {
  const question = await Question.findById(questionId);

  const { selectedOptions } = questionData;

  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, "Question not found");
  }

  const attempt = await Attempt.findOne({
    user: currentUser._id,
    quiz: question.quiz,
    completed: false,
  });

  if (!attempt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Active quiz attempt not found");
  }

  const quiz = await Quiz.findById(question.quiz);
  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
  }

  const currentTime = new Date();
  let _startTime = new Date(attempt.startTime);

  const allowedEndTime = new Date(
    _startTime.getTime() + quiz.totalTimeAllowed * 1000
  );

  // if (currentTime > allowedEndTime) {
  //   throw new ApiError(httpStatus.FORBIDDEN, "Time is up for this quiz");
  // }

  const noIncorrectOptionsSelected = question.options
    .filter((option) => !option.isCorrect)
    .every((option) => !selectedOptions.includes(option.text));

  const isCorrect = noIncorrectOptionsSelected;

  const endTime = new Date();
  const startTime = new Date(attempt.startTime);
  const duration = Math.floor((endTime - startTime) / 1000);

  await AttemptedQuestion.create({
    attemptedQuizId: attempt._id,
    questionId: question._id,
    userId: currentUser._id,
    selectedOptions,
    isCorrect,
    startTime,
    endTime,
    duration,
  });

  if (isCorrect) {
    attempt.totalCorrectMarks += question.marksAwarded;
  }

  await attempt.save();

  return { isCorrect };
};

module.exports = {
  startQuizAttempt,
  recordQuestionAttempt,
};
