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
  // if (!req.file) {
  //   throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, "No files uploaded");
  // }

  const fileBuffer = req.file.buffer;
  let upload;
  if (req.file) {
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
});

module.exports = {
  createQuestion,
};
