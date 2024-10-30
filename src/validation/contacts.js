import Joi from 'joi';
import { contactTypeList, phoneNumberRegExp } from '../constants/contacts.js';

export const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Min {#limit} chars',
    'string.max': 'Max {#limit} chars',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().pattern(phoneNumberRegExp).required().messages({
    'string.pattern.base': 'Phone number format: +380XXXXXXXXX',
  }),
  email: Joi.string().email(),
  isFavorite: Joi.boolean(),
  contactType: Joi.string().valid(...contactTypeList),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Name must be a string',
    'string.min': 'Min {#limit} chars',
    'string.max': 'Max {#limit} chars',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().pattern(phoneNumberRegExp).messages({
    'string.pattern.base': 'Phone number format: +380XXXXXXXXX',
  }),
  email: Joi.string().email(),
  isFavorite: Joi.boolean(),
  contactType: Joi.string().valid(...contactTypeList),
});
