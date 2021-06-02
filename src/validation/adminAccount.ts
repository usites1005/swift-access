import { Joi, Segments } from 'celebrate';

export const createAdminAccount = {
	[Segments.BODY]: Joi.object().keys({
		adminBTCAddress: Joi.string().required(),
		adminETHAddress: Joi.string().required(),
		adminTronAddress: Joi.string().required(),
	}),
};

export const addCoinAddress = {
	[Segments.BODY]: Joi.object()
		.keys({
			adminETHAddress: Joi.string().allow(null, ''),
			adminTronAddress: Joi.string().allow(null, ''),
			adminBTCAddress: Joi.string().allow(null, ''),
		})
		.or('adminETHAddress', 'adminTronAddress', 'adminBTCAddress'),
};
