const Joi = require("joi");

const startQuizAttempt = {
  headers: Joi.object({
    token: Joi.string().required(),
  }),
  params: Joi.object().keys({
    quizId: Joi.string().required(),
  }),
};

module.exports = {
  startQuizAttempt,
};
