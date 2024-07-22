const Joi = require("joi");

const createQuiz = {
  headers: Joi.object({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
  }),
};

const editQuiz = {
  headers: Joi.object({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
  }),
};

module.exports = {
  createQuiz,
  editQuiz,
};
