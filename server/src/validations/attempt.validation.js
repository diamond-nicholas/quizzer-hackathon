const Joi = require("joi");

const startQuizAttempt = {
  headers: Joi.object({
    token: Joi.string().required(),
  }),
  params: Joi.object().keys({
    quizId: Joi.string().required(),
  }),
};

const recordQuestionAttempt = {
  headers: Joi.object({
    token: Joi.string().required(),
  }),
  params: Joi.object().keys({
    questionId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    selectedOptions: Joi.array().items(Joi.string()).required(),
  }),
};

module.exports = {
  startQuizAttempt,
  recordQuestionAttempt,
};
