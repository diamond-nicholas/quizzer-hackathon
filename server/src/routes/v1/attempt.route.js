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

router.get(
  "/question/:attemptId/next",
  isAuthenticated,
  validate(attemptValidation.getNextQuestion),
  attemptController.getNextQuestion
);

router.get(
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

module.exports = router;
