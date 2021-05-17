import { Joi, Segments } from 'celebrate';

export const signup = {
	[Segments.BODY]: Joi.object().keys({
		fullName: Joi.string().required(),
		username: Joi.string().required(),
		bitcoinA: Joi.string().required(),
		sQuestion: Joi.string().required(),
		sAnswer: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().required(),
		refBy: Joi.string().allow(null, ''),
		imageURL: Joi.string().allow(null, ''),
	}),
};

export const update = {
	[Segments.BODY]: Joi.object().keys({
		fullName: Joi.string().required(),
		imageURL: Joi.string(),
	}),
};
