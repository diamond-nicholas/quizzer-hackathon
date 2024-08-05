const express = require("express");
const router = express.Router();
const validate = require("../../middlewares/validate");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const { attemptValidation } = require("../../validations");
const { attemptController } = require("../../controllers");

router.post(
  "/:quizId/quiz",
  isAuthenticated,
  validate(attemptValidation.startQuizAttempt),
  attemptController.startQuizAttempt
);

router.post(
  "/:questionId/question",
  isAuthenticated,
  validate(attemptValidation.recordQuestionAttempt),
  attemptController.recordQuestionAttempt
);

router.post(
  "/question/:attemptId/next",
  isAuthenticated,
  validate(attemptValidation.getNextQuestion),
  attemptController.getNextQuestion
);

router.post(
  "/question/:attemptId/prev",
  isAuthenticated,
  validate(attemptValidation.getPreviousQuestion),
  attemptController.getPreviousQuestion
);

router.post(
  "/:attemptId/submit",
  isAuthenticated,
  validate(attemptValidation.sumbitQuiz),
  attemptController.sumbitQuiz
);

router.get("/history", isAuthenticated, attemptController.getQuizHistory);

module.exports = router;
