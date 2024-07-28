const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const {
  Token,
  User,
  Quiz,
  Attempt,
  Question,
  AttemptQuestion,
} = require("../models");
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
    isAttempted: true,
  });

  if (isCorrect) {
    attempt.totalCorrectMarks += question.marksAwarded;
  }

  await attempt.save();

  return { isCorrect };
};

const getNextQuestion = async (currentUser, attemptId) => {
  if (currentUser.role !== "user") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You don't have permission to do this"
    );
  }

  const attempt = await Attempt.findById(attemptId).populate("quiz");

  if (!attempt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Attempt not found");
  }

  const quiz = attempt.quiz;

  const attemptedQuestions = await AttemptedQuestion.find({
    attemptedQuizId: attemptId,
    userId: currentUser._id,
    isAttempted: true,
  }).select("questionId");

  console.log(attemptedQuestions, "initial");

  const attemptedQuestionIds = attemptedQuestions.map((aq) => aq.questionId);

  console.log(attemptedQuestionIds, "ids");

  const nextQuestion = await Question.findOne({
    quiz: quiz._id,
    _id: { $nin: attemptedQuestionIds },
  });

  if (!nextQuestion) {
    return "End of questions";
  }

  return {
    _id: nextQuestion._id,
    questionText: nextQuestion.questionText,
    options: nextQuestion.options.map((opt) => opt.text),
  };
};

const getPreviousQuestion = async (currentUser, attemptId) => {
  if (currentUser.role !== "user") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You don't have permission to do this"
    );
  }

  const attempt = await Attempt.findById(attemptId).populate("quiz");

  if (!attempt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Attempt not found");
  }

  const quiz = attempt.quiz;

  const attemptedQuestions = await AttemptedQuestion.find({
    attemptedQuizId: attemptId,
    userId: currentUser._id,
    isAttempted: true,
  }).select("questionId");

  const attemptedQuestionIds = attemptedQuestions.map((aq) => aq.questionId);

  console.log(attemptedQuestionIds, "ids");

  const previousQuestion = await Question.findOne({
    quiz: quiz._id,
    _id: { $in: attemptedQuestionIds },
  }).sort({ _id: -1 });

  if (!previousQuestion) {
    return "No previous questions";
  }

  return {
    _id: previousQuestion._id,
    questionText: previousQuestion.questionText,
    options: previousQuestion.options.map((opt) => opt.text),
  };
};

const sumbitQuiz = async (currentUser, attemptId) => {
  if (currentUser.role == "tutor") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "you dont have permission to do this"
    );
  }

  const attempt = await Attempt.findById(attemptId).populate("quiz");

  if (!attempt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Attempt not found");
  }

  const quiz = attempt.quiz;
  const attemptedQuestions = await AttemptedQuestion.find({
    attemptedQuizId: attemptId,
  }).populate("questionId");

  console.log(attemptedQuestions, "attemptedQuestions");

  const score = attemptedQuestions.reduce(
    (total, aq) => total + (aq.isCorrect ? aq.questionId.marksAwarded : 0),
    0
  );

  attempt.completed = true;
  attempt.endTime = new Date();
  attempt.totalCorrectMarks = score;

  await attempt.save();

  return {
    totalScore: score,
  };
};

const getLeaderBoard = async (currentUser, quizId) => {
  const attempts = await Attempt.find({ quiz: quizId, completed: true })
    .populate("user")
    .populate("quiz");

  const leaderboard = attempts.map((attempt) => {
    const durationInMinutes =
      (attempt.endTime - attempt.startTime) / (1000 * 60);

    const formattedDuration = isNaN(durationInMinutes)
      ? 0
      : durationInMinutes.toFixed(2);

    return {
      name: attempt.user.fullName,
      duration: formattedDuration + " minutes",
      score: attempt.totalCorrectMarks,
      passMark: attempt.quiz.passMark,
      title: attempt.quiz.title,
      totalQuestions: attempt.quiz.totalQuestions,
      totalTimeAllowed: attempt.quiz.totalTimeAllowed / 60 + " Minutes",
    };
  });
  leaderboard.sort((a, b) => b.score - a.score);

  return leaderboard;
};

const getQuizHistory = async (currentUser) => {
  const attempts = await Attempt.find({ user: currentUser._id })
    .populate("quiz")
    .populate("user");

  let passedCount = 0;
  let failedCount = 0;
  let completeCount = 0;
  let incompleteCount = 0;

  const attemptDetails = attempts.map((attempt) => {
    const isPassed = attempt.totalCorrectMarks >= attempt.quiz.passMark;
    const isComplete = attempt.completed;

    if (isComplete) {
      completeCount++;
      if (isPassed) {
        passedCount++;
      } else {
        failedCount++;
      }
    } else {
      incompleteCount++;
    }

    const durationInMinutes =
      (attempt.endTime - attempt.startTime) / (1000 * 60);
    const formattedDuration = isNaN(durationInMinutes)
      ? "0.00"
      : durationInMinutes.toFixed(2);

    return {
      name: attempt.user.fullName,
      duration: `${formattedDuration} minutes`,
      score: attempt.totalCorrectMarks,
      passMark: attempt.quiz.passMark,
      title: attempt.quiz.title,
      totalQuestions: attempt.quiz.totalQuestions,
      totalTimeAllowed: `${(attempt.quiz.totalTimeAllowed / 60).toFixed(
        2
      )} minutes`,
      isPassed,
      isComplete,
    };
  });

  return {
    summary: {
      totalAttempts: attempts.length,
      passedCount,
      failedCount,
      completeCount,
      incompleteCount,
    },
    details: attemptDetails,
  };
};

module.exports = {
  startQuizAttempt,
  recordQuestionAttempt,
  getNextQuestion,
  getPreviousQuestion,
  sumbitQuiz,
  getLeaderBoard,
  getQuizHistory,
};
