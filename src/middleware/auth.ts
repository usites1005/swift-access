import { Request, Response, NextFunction } from 'express';
import TokenService from '../services/token';
import AdminModel from '../models/Admin';
import UserModel from '../models/User';
import APIError from '../common/APIError';
import httpStatus from 'http-status';
import IRequest, { TAllUsers } from '../types/expressTypes';
import UserService from '../services/user';
import { IAllUsers } from '../types/admin';
import config from '../config/env';

const loginSecret = config.loginSecret;

const getToken = (req: Request) => {
	let tokenToVerify;
	const authHeader = req.headers.authorization;

	if (authHeader) {
		const token = authHeader.split('Bearer ')[1];

		if (token) {
			tokenToVerify = token;
		} else {
			throw new APIError({
				message: 'Format for Authorization: Bearer [token]',
				status: httpStatus.UNAUTHORIZED,
			});
		}
	} else if (req.body.token) {
		tokenToVerify = req.body.token;
		delete req.query.token;
	} else {
		throw new APIError({
			message: 'Unauthorized User',
			status: httpStatus.UNAUTHORIZED,
		});
	}
	return tokenToVerify;
};

export default class AuthMiddleware {
	static async userAuth(req: IRequest, _res: Response, next: NextFunction) {
		try {
			const tokenToVerify = getToken(req);

			const verificationResponse = TokenService.verifyToken(
				tokenToVerify,
				loginSecret
			);
			const id = verificationResponse.user.id;
			const user = await UserModel.findById(id);
			if (user) {
				req.user = user as TAllUsers;
			} else {
				throw new APIError({
					message: 'Unauthorized user',
					status: httpStatus.UNAUTHORIZED,
				});
			}
			next();
		} catch (error) {
			next(error);
		}
	}

	static async adminOnlyAuth(
		req: IRequest,
		_res: Response,
		next: NextFunction
	) {
		try {
			const tokenToVerify = getToken(req);

			const verificationResponse = TokenService.verifyToken(
				tokenToVerify,
				loginSecret
			);
			const id = verificationResponse.user.id;

			const user = await AdminModel.findById(id);

			if (user && user.role === 'Admin') {
				req.user = user as TAllUsers;
			} else {
				throw new APIError({
					message: 'Unauthorized user',
					status: httpStatus.UNAUTHORIZED,
				});
			}
			next();
		} catch (error) {
			next(error);
		}
	}

	static async allUsers(req: IRequest, _res: Response, next: NextFunction) {
		try {
			const tokenToVerify = getToken(req);

			const verificationResponse = TokenService.verifyToken(
				tokenToVerify,
				loginSecret
			);
			const id = verificationResponse.user.id;

			let user = await AdminModel.findById(id);
			if (!user) user = (await UserService.getUser({ _id: id })) as IAllUsers;

			if (user) {
				req.user = user as TAllUsers;
			} else {
				throw new APIError({
					message: 'Unauthorized user',
					status: httpStatus.UNAUTHORIZED,
				});
			}
			next();
		} catch (error) {
			next(error);
		}
	}

	static async superAdminAuth(
		req: IRequest,
		_res: Response,
		next: NextFunction
	) {
		try {
			const tokenToVerify = getToken(req);

			const verificationResponse = TokenService.verifyToken(
				tokenToVerify,
				loginSecret
			);
			const id = verificationResponse.user.id;

			const user = await AdminModel.findById(id);

			if (user && user.role === 'Admin' && user.isSuper) {
				req.user = user as TAllUsers;
			} else {
				throw new APIError({
					message: 'Unauthorized user',
					status: httpStatus.UNAUTHORIZED,
				});
			}
			next();
		} catch (err) {
			next(err);
		}
	}
}
