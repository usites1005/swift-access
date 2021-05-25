import { Joi, Segments } from 'celebrate';

export const signup = {
	[Segments.BODY]: Joi.object().keys({
		fullName: Joi.string().required(),
		username: Joi.string().required(),
		btcAddr: Joi.string().required(),
		sQuestion: Joi.string().required(),
		sAnswer: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().required(),
		refBy: Joi.string().allow(null, ''),
		imageURL: Joi.string().allow(null, ''),
	}),
};

export const addCoinAddress = {
  [Segments.BODY]: Joi.object().keys({
		ethAddr: Joi.string(),
		tronAddr: Joi.string(),
	}),
}