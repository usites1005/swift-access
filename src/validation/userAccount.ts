import { Joi, Segments } from 'celebrate';

export const createUserAccount = {
	[Segments.BODY]: Joi.object().keys({
		amountDeposited: Joi.number().required(),
		destinationAddr: Joi.string().required(),
		sender: Joi.string().required(),
	}),
};
