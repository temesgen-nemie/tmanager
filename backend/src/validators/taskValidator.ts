import Joi from 'joi';

// Create Task Validation
export const createTaskSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Title is required',
    'string.empty': 'Title cannot be empty',
  }),
  description: Joi.string().allow('', null), // optional
});

// Update Task Validation
export const updateTaskSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  completed: Joi.boolean().optional(),
});
