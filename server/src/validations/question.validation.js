const Joi = require("joi");

const optionSchema = Joi.object({
  text: Joi.string().required(),
  isCorrect: Joi.boolean().required(),
});

const createQuestion = {
  headers: Joi.object({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    questionText: Joi.string().required(),
    marksAwarded: Joi.number().required(),
    quizId: Joi.string().required(),
    file: Joi.any(),
    isMultipleSelect: Joi.boolean().required(),
    allotedTime: Joi.number().required(),
    allotedMetric: Joi.string().required(),
    options: Joi.array().items(optionSchema).min(4).required(),
  }),
};

const editQuestion = {
  headers: Joi.object({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    questionText: Joi.string(),
    isMultipleSelect: Joi.boolean(),
    allotedTime: Joi.number(),
    allotedMetric: Joi.string(),
    options: Joi.array().items(optionSchema).min(4),
  }),
  params: Joi.object().keys({
    questionId: Joi.string().required(),
  }),
};

module.exports = {
  createQuestion,
  editQuestion,
};
