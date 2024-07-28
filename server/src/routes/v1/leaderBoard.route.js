const express = require("express");
const router = express.Router();
const validate = require("../../middlewares/validate");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const { attemptValidation } = require("../../validations");
const { attemptController } = require("../../controllers");

router.get(
  "/:quizId/top",
  isAuthenticated,
  validate(attemptValidation.getLeaderBoard),
  attemptController.getLeaderBoard
);

module.exports = router;
