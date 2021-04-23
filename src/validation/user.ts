import { Joi, Segments } from 'celebrate';
// import { enumToArray, LocationEnumType } from '../types/admin';

export const signup = {
	[Segments.BODY]: Joi.object().keys({
		fullName: Joi.string().required(),
		username: Joi.string().required(),
		bitcoinA: Joi.string().required(),
		sQuestion: Joi.string().required(),
		sAnswer: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().required(),
		// location: Joi.allow(...enumToArray(LocationEnumType)).required(),
		// phone: Joi.string().required(),
		imageURL: Joi.string(),
	}),
};

export const update = {
	[Segments.BODY]: Joi.object().keys({
		fullName: Joi.string().required(),
		imageURL: Joi.string(),
	}),
};
