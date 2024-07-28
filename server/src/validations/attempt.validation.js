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

const getNextQuestion = {
  headers: Joi.object({
    token: Joi.string().required(),
  }),
  params: Joi.object().keys({
    attemptId: Joi.string().required(),
  }),
};

const getPreviousQuestion = {
  headers: Joi.object({
    token: Joi.string().required(),
  }),
  params: Joi.object().keys({
    attemptId: Joi.string().required(),
  }),
};

const getLeaderBoard = {
  headers: Joi.object({
    token: Joi.string().required(),
  }),
  params: Joi.object().keys({
    quizId: Joi.string().required(),
  }),
};

const sumbitQuiz = {
  headers: Joi.object({
    token: Joi.string().required(),
  }),
  params: Joi.object().keys({
    attemptId: Joi.string().required(),
  }),
};

module.exports = {
  startQuizAttempt,
  recordQuestionAttempt,
  getNextQuestion,
  getPreviousQuestion,
  sumbitQuiz,
  getLeaderBoard,
};
