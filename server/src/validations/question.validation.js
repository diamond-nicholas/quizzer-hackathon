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
    quizId: Joi.string().required(),
    userId: Joi.string().required(),
    file: Joi.any(),
    isMultipleSelect: Joi.boolean().required(),
    allotedTime: Joi.number().required(),
    allotedMetric: Joi.string().required(),
    // options: Joi.array()
    //   .items(
    //     Joi.object({
    //       text: Joi.string().required(),
    //       isCorrect: Joi.boolean().required(),
    //     })
    //   )
    //   .min(4)
    //   .required(),
    options: Joi.array().items(optionSchema).min(4).required(),
  }),
};

module.exports = {
  createQuestion,
};
