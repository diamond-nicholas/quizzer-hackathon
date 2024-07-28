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
  params: Joi.object().keys({
    quizId: Joi.string().required(),
  }),
};

const getOneQuiz = {
  headers: Joi.object({
    token: Joi.string().required(),
  }),
  params: Joi.object().keys({
    quizId: Joi.string().required(),
  }),
};

const publishQuiz = {
  headers: Joi.object({
    token: Joi.string().required(),
  }),
  params: Joi.object().keys({
    quizId: Joi.string().required(),
  }),
};

const getAllQuiz = {
  headers: Joi.object({
    token: Joi.string().required(),
  }),
};

module.exports = {
  createQuiz,
  editQuiz,
  getOneQuiz,
  getAllQuiz,
  publishQuiz,
};
