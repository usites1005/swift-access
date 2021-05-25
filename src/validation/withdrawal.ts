import { Joi, Segments } from 'celebrate';

export const withdrawalRequest = {
  [Segments.BODY]: Joi.object().keys({
		userId: Joi.string().required(),
		dollarAmount: Joi.string().required(),
		destination: Joi.string().required(),
		sender: Joi.string().required(),
		comment: Joi.string(),
	}),
}

export const updateWithdrawalStatus = {
  [Segments.BODY]: Joi.object().keys({
		userId: Joi.string().required(),
		withdrawalId: Joi.string().required(),
		comment: Joi.string(),
	}),
}