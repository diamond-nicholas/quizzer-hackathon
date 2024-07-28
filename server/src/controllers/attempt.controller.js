const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const {
  authService,
  tokenService,
  userService,
  quizService,
  questionService,
  attemptService,
} = require("../services");
const pick = require("../utils/pick");
const Upload = require("../utils/cloudinaryConfig");

const startQuizAttempt = catchAsync(async (req, res) => {
  const result = await attemptService.startQuizAttempt(
    req.user,
    req.params.quizId
  );

  res.status(httpStatus.ACCEPTED).send({
    message: "",
    data: result,
  });
});

module.exports = {
  startQuizAttempt,
};
