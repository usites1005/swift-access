import { Joi, Segments } from 'celebrate';

export const login = {
	[Segments.BODY]: Joi.object().keys({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	}),
};

export const verifyAccount = {
	[Segments.BODY]: Joi.object().keys({
		token: Joi.string().required(),
	}),
};

export const changePassword = {
	[Segments.BODY]: Joi.object().keys({
		oldPassword: Joi.string().required(),
		newPassword: Joi.string().required(),
	}),
};

export const forgotPassword = {
	[Segments.BODY]: Joi.object().keys({
		email: Joi.string().required(),
	}),
};

export const resetPassword = {
	[Segments.BODY]: Joi.object().keys({
		email: Joi.string().required(),
		resetCode: Joi.string().required(),
		newPassword: Joi.string().required(),
	}),
};
