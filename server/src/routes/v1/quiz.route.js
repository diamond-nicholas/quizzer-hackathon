const express = require("express");
const router = express.Router();
const validate = require("../../middlewares/validate");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const { quizValidation } = require("../../validations");
const { quizController } = require("../../controllers");

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

module.exports = router;
