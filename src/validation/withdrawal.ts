import { Joi, Segments } from 'celebrate';

export const withdrawalRequest = {
	[Segments.BODY]: Joi.object().keys({
		dollarAmount: Joi.number().required(),
		destinationAddr: Joi.string().required(),
	}),
};

export const updateWithdrawalStatus = {
	[Segments.BODY]: Joi.object().keys({
		userId: Joi.string().required(),
		withdrawalId: Joi.string().required(),
		comment: Joi.string(),
	}),
};
