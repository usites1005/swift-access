import { Joi, Segments } from 'celebrate';

export const create = {
	[Segments.BODY]: Joi.object().keys({
		fullName: Joi.string(),
		username: Joi.string(),
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	}),
};

export const login = {
	[Segments.BODY]: Joi.object().keys({
		email: Joi.string().required(),
		password: Joi.string().required(),
	}),
};

export const update = {
	[Segments.BODY]: Joi.object().keys({
		fullName: Joi.string().required(),
		imageURL: Joi.string(),
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
