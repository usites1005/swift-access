import { Joi, Segments } from 'celebrate';
import { AdminEnumType } from '../types/admin';
import { enumToArray } from '../types/general';

export const create = {
	[Segments.BODY]: Joi.object().keys({
		email: Joi.string().email().required(),
		role: Joi.allow(...enumToArray(AdminEnumType)).required(),
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
		username: Joi.string().required(),
		// phone: Joi.string(),
		imageURL: Joi.string(),
		role: Joi.allow(...enumToArray(AdminEnumType)),
		isSuper: Joi.boolean(),
	}),
};
