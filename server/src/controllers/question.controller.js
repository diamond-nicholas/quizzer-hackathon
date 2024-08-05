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
} = require("../services");
const pick = require("../utils/pick");
const Upload = require("../utils/cloudinaryConfig");

const createQuestion = catchAsync(async (req, res) => {
  let upload;
  if (req.file) {
    const fileBuffer = req.file.buffer;
    upload = await Upload.uploadFile(fileBuffer);
  }

  const result = await questionService.createQuestion(
    req.body,
    req.user,
    upload
  );

  res.status(httpStatus.ACCEPTED).send({
    message: "success",
    data: result,
  });
  try {
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error });
  }
});

const editQuestion = catchAsync(async (req, res) => {
  const result = await questionService.editQuestion(
    req.user,
    req.params.questionId,
    req.body
  );

  res.status(httpStatus.ACCEPTED).send({
    message: "",
    data: result,
  });
});

module.exports = {
  createQuestion,
  editQuestion,
};
