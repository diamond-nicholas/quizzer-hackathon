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

module.exports = router;
