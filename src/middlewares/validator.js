const Joi = require('joi');

const articleSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  content: Joi.string().trim().min(1).required(),
  author: Joi.string().trim().min(1).required(),
  category: Joi.string().trim().allow('', null),
  tags: Joi.string().trim().allow('', null)
});

const validateArticle = (req, res, next) => {
  const { error } = articleSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }
  next();
};

module.exports = {
  validateArticle
};
