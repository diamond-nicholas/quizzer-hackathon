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

  if (currentUser.role === "tutor") {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Tutor can't attempt quiz");
  }

  if (!quiz.isPublished) {
    throw new ApiError(
      httpStatus.UNPROCESSABLE_ENTITY,
      "Quiz is not published"
    );
  }

  // Create a new quiz attempt record
  const attempt = await Attempt.create({
    user: currentUser._id,
    quiz: quizId,
    startTime: new Date(),
    currentQuestionIndex: 0,
  });

  const questions = await Question.find({ quiz: quizId }).sort("questionText");
  const firstQuestion = questions[0];

  if (!firstQuestion) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "No questions found for this quiz"
    );
  }

  await AttemptedQuestion.create({
    attemptedQuizId: attempt._id,
    questionId: firstQuestion._id,
    userId: currentUser._id,
    startTime: new Date(),
    isCorrect: false,
    isAttempted: false,
  });

  const durationUsed = 0;
  const remainingTime = firstQuestion.allotedTime;

  return {
    attempt,
    firstQuestion: {
      _id: firstQuestion._id,
      questionText: firstQuestion.questionText,
      options: firstQuestion.options.map((opt) => opt.text),
      image: firstQuestion.image,
      isMultipleSelect: firstQuestion.isMultipleSelect,
      allotedTime: firstQuestion.allotedTime,
      allotedMetric: firstQuestion.allotedMetric,
      durationUsed: durationUsed,
      remainingTime: remainingTime,
      hasPrevQuestion: false,
      hasNextQuestion: questions.length > 1,
    },
  };
};

// const startQuizAttempt = async (currentUser, quizId) => {
//   const quiz = await Quiz.findById(quizId);

//   if (!quiz) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
//   }

//   if (currentUser === "tutor") {
//     throw new ApiError(httpStatus.UNAUTHORIZED, "Tutor can't attempt quiz");
//   }

//   if (!quiz.isPublished) {
//     throw new ApiError(
//       httpStatus.UNPROCESSABLE_ENTITY,
//       "Quiz is not published"
//     );
//   }

//   const attempt = await Attempt.create({
//     user: currentUser._id,
//     quiz: quizId,
//     startTime: new Date(),
//   });

//   return attempt;
// };

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

  if (currentTime > allowedEndTime) {
    throw new ApiError(httpStatus.FORBIDDEN, "Time is up for this quiz");
  }

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
  const allQuestions = await Question.find({ quiz: quiz._id }).sort("_id");

  let currentQuestionIndex = attempt.currentQuestionIndex;

  if (currentQuestionIndex >= allQuestions.length) {
    currentQuestionIndex = allQuestions.length - 1; // Make sure it's not out of bounds
  }

  const nextQuestion = allQuestions[currentQuestionIndex];

  // Create or update the attempted question record
  const attemptedQuestion = await AttemptedQuestion.findOneAndUpdate(
    {
      attemptedQuizId: attemptId,
      questionId: nextQuestion._id,
      userId: currentUser._id,
    },
    { startTime: new Date(), isCorrect: false },
    { upsert: true, new: true }
  );

  // Only update the index if we are not at the end
  if (currentQuestionIndex < allQuestions.length - 1) {
    attempt.currentQuestionIndex = currentQuestionIndex + 1;
  }
  await attempt.save();

  const hasPrevQuestion = currentQuestionIndex > 0;
  const hasNextQuestion = currentQuestionIndex < allQuestions.length - 1;
  const durationUsed = Math.floor(
    (new Date() - new Date(attemptedQuestion.startTime)) / 60000
  );
  const remainingTime = nextQuestion.allotedTime - durationUsed;

  return {
    _id: nextQuestion._id,
    questionText: nextQuestion.questionText,
    options: nextQuestion.options.map((opt) => opt.text),
    image: nextQuestion.image,
    isMultipleSelect: nextQuestion.isMultipleSelect,
    allotedTime: nextQuestion.allotedTime,
    allotedMetric: nextQuestion.allotedMetric,
    durationUsed: durationUsed,
    remainingTime: remainingTime,
    hasPrevQuestion: hasPrevQuestion,
    hasNextQuestion: hasNextQuestion,
  };
};

const getPrevQuestion = async (currentUser, attemptId) => {
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
  const allQuestions = await Question.find({ quiz: quiz._id }).sort("_id");

  let currentQuestionIndex = attempt.currentQuestionIndex;

  if (currentQuestionIndex <= 0) {
    currentQuestionIndex = 0; // Make sure it's not out of bounds
  } else {
    currentQuestionIndex -= 1;
  }

  const prevQuestion = allQuestions[currentQuestionIndex];

  const attemptedQuestion = await AttemptedQuestion.findOne({
    attemptedQuizId: attemptId,
    questionId: prevQuestion._id,
    userId: currentUser._id,
  });

  // Update the current question index in the attempt
  attempt.currentQuestionIndex = currentQuestionIndex;
  await attempt.save();

  const hasPrevQuestion = currentQuestionIndex > 0;
  const hasNextQuestion = currentQuestionIndex < allQuestions.length - 1;
  const durationUsed = attemptedQuestion
    ? Math.floor((new Date() - new Date(attemptedQuestion.startTime)) / 60000)
    : 0;
  const remainingTime = prevQuestion.allotedTime - durationUsed;

  return {
    _id: prevQuestion._id,
    questionText: prevQuestion.questionText,
    options: prevQuestion.options.map((opt) => opt.text),
    image: prevQuestion.image,
    isMultipleSelect: prevQuestion.isMultipleSelect,
    allotedTime: prevQuestion.allotedTime,
    allotedMetric: prevQuestion.allotedMetric,
    durationUsed: durationUsed,
    remainingTime: remainingTime,
    hasPrevQuestion: hasPrevQuestion,
    hasNextQuestion: hasNextQuestion,
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
  getPrevQuestion,
  sumbitQuiz,
  getLeaderBoard,
  getQuizHistory,
};
