const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const {
  authService,
  tokenService,
  userService,
  quizService,
} = require("../services");
const pick = require("../utils/pick");

const createQuiz = catchAsync(async (req, res) => {
  const result = await quizService.createQuiz(req.body, req.user);

  res.status(httpStatus.ACCEPTED).send({
    message: "",
    data: result,
  });
});

const editQuiz = catchAsync(async (req, res) => {
  const result = await quizService.editQuiz(
    req.body,
    req.params.quizId,
    req.user
  );

  res.status(httpStatus.ACCEPTED).send({
    message: "",
    data: result,
  });
});

module.exports = {
  createQuiz,
  editQuiz,
};
