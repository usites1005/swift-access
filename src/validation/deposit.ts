import { Joi, Segments } from 'celebrate';

export const depositRequest = {
	[Segments.BODY]: Joi.object().keys({
		amountDeposited: Joi.number().required(),
		destinationAddr: Joi.string().required(),
		sender: Joi.string().required(),
	}),
};

export const updateDepositStatus = {
	[Segments.BODY]: Joi.object().keys({
		depositId: Joi.string().required(),
	}),
};

export const unconfirmedDeposit = {
	[Segments.BODY]: Joi.object().keys({
		depositId: Joi.string().required(),
	}),
};
