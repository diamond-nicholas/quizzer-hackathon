const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const { Token, User, Quiz, Question } = require("../models");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/token");
const logger = require("../config/logger");

const createQuestion = async (questionData, currentUser, file) => {
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

  if (currentUser._id.toString() !== quiz.user.toString()) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Only quiz author can add questions"
    );
  }

  if (quiz.isPublished) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Can't add questions to published quiz"
    );
  }

  const question = await Question.create({
    questionText: questionData.questionText,
    quiz: questionData.quizId,
    marksAwarded: questionData.marksAwarded,
    user: currentUser._id,
    options: questionData.options,
    image: file || null,
    isMultipleSelect: questionData.isMultipleSelect,
    allotedTime: questionData.allotedTime,
    allotedMetric: questionData.allotedMetric,
  });

  quiz.totalQuestions += 1;

  let allotedTimeInSeconds;
  switch (questionData.allotedMetric) {
    case "hours":
      allotedTimeInSeconds = questionData.allotedTime * 3600;
      break;
    case "minutes":
      allotedTimeInSeconds = questionData.allotedTime * 60;
      break;
    case "seconds":
      allotedTimeInSeconds = questionData.allotedTime;
      break;
    default:
      allotedTimeInSeconds = questionData.allotedTime * 60;
  }

  quiz.totalTimeAllowed += allotedTimeInSeconds;

  await quiz.save();

  return question;
};

const editQuestion = async (currentUser, questionId, questionData) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, "Question not found");
  }

  const quiz = await Quiz.findById(question.quiz);

  if (
    quiz.isPublished ||
    question.user.toString() !== currentUser._id.toString()
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You do not have permision");
  }

  question.questionText = questionData.questionText || question.questionText;

  question.marksAwarded = questionData.marksAwarded || question.marksAwarded;

  question.allotedTime = questionData.allotedTime || question.allotedTime;

  question.allotedMetric = questionData.allotedMetric || question.allotedMetric;

  question.isMultipleSelect =
    questionData.isMultipleSelect || question.isMultipleSelect;

  question.options = questionData.options || question.options;

  let allotedTimeInSeconds;

  if (questionData.allotedMetric || questionData.allotedTime) {
    let usableMetric = questionData.allotedMetric
      ? questionData.allotedMetric
      : question.allotedMetric;

    let usableTime = questionData.allotedTime
      ? questionData.allotedTime
      : question.allotedTime;

    switch (usableMetric) {
      case "hours":
        allotedTimeInSeconds = usableTime * 3600;
        break;
      case "minutes":
        allotedTimeInSeconds = usableTime * 60;
        break;
      case "seconds":
        allotedTimeInSeconds = usableTime;
        break;
      default:
        allotedTimeInSeconds = usableTime * 60;
    }
  }

  quiz.totalTimeAllowed = allotedTimeInSeconds;

  await quiz.save();
  await question.save();

  return question;
};

module.exports = {
  createQuestion,
  editQuestion,
};
