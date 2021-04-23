import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import UserService from '../services/user';
// import OTPCodeService from '../services/otpCode';
// import { IOTPCode } from '../types/otpCode';
import sendResponse from '../common/response';
import APIError from '../common/APIError';
import IRequest from '../types/expressTypes';
// import EmailService from '../services/email';

export default class UserController {
	static async getUsers(req: IRequest, res: Response, next: NextFunction) {
		try {
			let data = req.query;
			const users = req.user?.isSuper
				? await UserService.getUsers({ ...data })
				: await UserService.getUsers({ ...data });
			res.json(sendResponse(httpStatus.OK, 'Users found', users));
		} catch (err) {
			next(err);
		}
	}

	static async signUp(req: Request, res: Response, next: NextFunction) {
		try {
			const data = req.body;

			const newUser = await UserService.create(data);

			//  // create account verification for user
			// const code = await OTPCodeService.create({
			//   user: newUser,
			//   reference: newUser._id,
			//   referenceModel: 'User',
			// } as IOTPCode);

			// const message =
			//   "You are getting this mail because you sign up for the Diapers Fund. Kindly ignore if you didn't.";

			// EmailService.sendOTPMail(newUser, message, code);

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

			const user = req.user?.isSuper
				? await UserService.getUser({ ...data, _id })
				: await UserService.getUser({ ...data, _id });
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
			let _id = req.sub;
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

	static async updateUser(req: IRequest, res: Response, next: NextFunction) {
		try {
			let id = req.sub;
			const user = await UserService.updateUser({ ...req.body, id });
			if (!user) {
				throw new APIError({
					message: 'User not found',
					status: httpStatus.NOT_FOUND,
				});
			}
			res.json(sendResponse(httpStatus.OK, 'User updated', user));
		} catch (err) {
			next(err);
		}
	}
}
