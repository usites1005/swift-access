import { Joi, Segments } from 'celebrate';

export const addCoinAddress = {
	[Segments.BODY]: Joi.object().keys({
		currency: Joi.string().required(),
		address: Joi.string().required(),
	}),
};

export const toggleAddressActive = {
	[Segments.BODY]: Joi.object().keys({
		addressId: Joi.string().required(),
	}),
};
