import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import UserService from '../services/user';
import sendResponse from '../common/response';
import APIError from '../common/APIError';
import IRequest from '../types/general';
import EmailService from '../services/email';

export default class UserController {
	static async getUsers(req: IRequest, res: Response, next: NextFunction) {
		try {
			let data = req.query;
			const users = await UserService.getUsers({ ...data });
			res.json(sendResponse(httpStatus.OK, 'Users found', users));
		} catch (err) {
			next(err);
		}
	}
	static async getUserReferrals(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const { username } = req.user!;
			const users = await UserService.getUsers({ refBy: username });
			res.json(sendResponse(httpStatus.OK, 'Users found', users));
		} catch (err) {
			next(err);
		}
	}

	static async signUp(req: Request, res: Response, next: NextFunction) {
		try {
			const data = req.body;

			const newUser = await UserService.create(data);

			// send account verification to user
			EmailService.sendVerificationMail(newUser.toJSON());

			res.json(
				sendResponse(httpStatus.CREATED, 'User created successfully', newUser)
			);
		} catch (err) {
			next(
				new APIError({
					message: err.message,
					status: 400,
				})
			);
		}
	}

	static async getUser(req: IRequest, res: Response, next: NextFunction) {
		try {
			let _id = req.params.userId;
			let data = req.query;

			const user = await UserService.getUser({ ...data, _id });
			if (!user) {
				throw new APIError({
					message: 'User not found',
					status: httpStatus.NOT_FOUND,
				});
			}
			res.json(sendResponse(httpStatus.OK, 'User found', user));
		} catch (err) {
			next(err);
		}
	}

	static async getMe(req: IRequest, res: Response, next: NextFunction) {
		try {
			let { _id } = req.user!;
			const user = await UserService.getUser({ _id });
			if (!user) {
				throw new APIError({
					message: 'User not found',
					status: httpStatus.NOT_FOUND,
				});
			}
			res.json(sendResponse(httpStatus.OK, 'User found', user));
		} catch (err) {
			next(err);
		}
	}

	static async addCoinAddress(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			let { id } = req.user!;
			const { ethAddr, tronAddr } = req.body;
			// check if the user has that coin already added
			const user = await UserService.getUser({ _id: id });
			if (ethAddr && user.ethAddr) {
				throw new APIError({
					message: 'You already have an ETH address.',
					status: httpStatus.FORBIDDEN,
				});
			}

			if (tronAddr && user.tronAddr) {
				throw new APIError({
					message: 'You already have a TRON address.',
					status: httpStatus.FORBIDDEN,
				});
			}

			const updatedUser = await UserService.updateUser({
				ethAddr,
				tronAddr,
				id,
			});
			res.json(sendResponse(httpStatus.OK, 'User updated', updatedUser));
		} catch (err) {
			next(err);
		}
	}
}
