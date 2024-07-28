const express = require("express");
const router = express.Router();
const validate = require("../../middlewares/validate");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const upload = require("../../utils/multer");
const { questionValidation } = require("../../validations");
const { questionController } = require("../../controllers");

router.post(
  "/create",
  isAuthenticated,
  upload.single("file"),
  validate(questionValidation.createQuestion),
  questionController.createQuestion
);

router.patch(
  "/:questionId/edit",
  isAuthenticated,
  validate(questionValidation.editQuestion),
  questionController.editQuestion
);

module.exports = router;
