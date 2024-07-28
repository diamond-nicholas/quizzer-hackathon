const express = require("express");
const router = express.Router();
const validate = require("../../middlewares/validate");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const { quizValidation, attemptValidation } = require("../../validations");
const { quizController, attemptController } = require("../../controllers");

router.post(
  "/create",
  isAuthenticated,
  validate(quizValidation.createQuiz),
  quizController.createQuiz
);

router.patch(
  "/:quizId/edit",
  isAuthenticated,
  validate(quizValidation.editQuiz),
  quizController.editQuiz
);

router.get(
  "/:quizId",
  isAuthenticated,
  validate(quizValidation.getOneQuiz),
  quizController.getOneQuiz
);

router.get(
  "/",
  isAuthenticated,
  validate(quizValidation.getAllQuiz),
  quizController.getAllQuiz
);

router.patch(
  "/:quizId/publish",
  isAuthenticated,
  validate(quizValidation.publishQuiz),
  quizController.publishQuiz
);

// router.get(
//   "/history",
//   isAuthenticated,
//   // validate(attemptValidation.getQuizHistory),
//   attemptController.getQuizHistory
// );

module.exports = router;
