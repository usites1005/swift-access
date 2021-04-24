import { Request, Response, NextFunction } from 'express';
import { FilterQuery } from 'mongoose';
import httpStatus from 'http-status';
import UserService from '../services/user';
import AdminService from '../services/admin';
import TokenService from '../services/token';
import AuthService from '../services/auth';
import config from '../config/env';
import sendResponse from '../common/response';
import APIError from '../common/APIError';
// import { IAdmin } from '../types/admin';
// import { IUser } from '../types/user';
import IRequest, { TAllUsers } from '../types/expressTypes';
import OTPCodeService from '../services/otpCode';
import { IOTPCode } from '../types/otpCode';
import EmailService from '../services/email';
import { TokenFor } from '../types/general';
import UserModel from '../models/User';

const loginExpiresIn = config.loginExpiresIn;
const loginSecret = config.loginSecret;
const verificationSecret = config.verificationSecret;

export default class AuthController {
	// static async resendToken(req: Request, res: Response, next: NextFunction) {
	// 	try {
	// 		const { userId } = req.body;
	// 		const tokenType = req.query.type as string;
	// 		let message =
	// 			'Kindly use this token complete your transaction on our page';
	// 		let referenceModel = 'User';
	// 		let user = await UserService.getUser({ _id: userId });
	// 		if (!user) {
	// 			throw new APIError({
	// 				message: 'User not found',
	// 				status: httpStatus.NOT_FOUND,
	// 			});
	// 		}
	// 		let reference = user._id;

	// 		if (tokenType === 'verify') {
	// 			message = 'Kindly use this token complete your verification';
	// 		}
	// 		if (tokenType === 'password') {
	// 			message = 'Kindly use this token complete your password change';
	// 		}
	// 		await OTPCodeService.deleteUserOTP({ reference } as IOTPCode);
	// 		// create account verification for user

	// 		const code = await OTPCodeService.create({
	// 			user: user._id,
	// 			reference,
	// 			referenceModel,
	// 		} as IOTPCode);

	// 		EmailService.sendVerificationMail(user, message, code);

	// 		res
	// 			.status(httpStatus.OK)
	// 			.json(sendResponse(httpStatus.OK, 'Token sent', user));
	// 	} catch (err) {
	// 		next(err);
	// 	}
	// }

	static async verifyEmail(req: Request, res: Response, next: NextFunction) {
		try {
			const { token } = req.body;
			const { email, tokenFor } = TokenService.verifyToken(
				token,
				verificationSecret
			);

			if (tokenFor !== TokenFor.AccountVerification) {
				throw new APIError({
					message: 'Invalid or expired token',
					status: 400,
				});
			}

			const user = await UserModel.findOne({ email });
			if (!user || user.deleted) {
				throw new APIError({
					message: 'Account does not exist',
					status: 401,
				});
			}
			if (user.isVerified) {
				throw new APIError({
					message: 'Account has been previously verified',
					status: 400,
				});
			}
			user.isVerified = true;
			user.save();

			const newToken = TokenService.generateToken(
				{ email, id: user.id, isVerified: user.isVerified },
				loginSecret,
				loginExpiresIn,
				TokenFor.Access
			);

			res
				.status(httpStatus.OK)
				.json(
					sendResponse(httpStatus.OK, 'Account verified', user, null, newToken)
				);
		} catch (error) {
			next(error);
		}
	}

	static async login(req: Request, res: Response, next: NextFunction) {
		const userType = req.params.type;
		try {
			const { email, password } = req.body;
			let user;
			if (userType === 'user') {
				user = await UserService.login(email, password);
			}
			if (userType === 'admin') {
				user = await AdminService.login(email, password);
			}

			if (!user) {
				throw new APIError({
					message: 'Invalid email or password',
					status: 400,
				});
			}
			const token = TokenService.generateToken(
				{ email, id: user.id, isVerified: user.isVerified },
				loginSecret,
				loginExpiresIn,
				TokenFor.Access
			);

			res.json(
				sendResponse(httpStatus.OK, 'Login successful', user, null, token)
			);
		} catch (err) {
			next(err);
		}
	}

	static async changePassword(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		const url = req.url.split('/');
		const userType = url[url.length - 1];

		try {
			const { oldPassword, newPassword } = req.body;
			const email = req.user!.email;

			let user;
			if (userType === 'user') {
				user = await UserService.changePassword(
					email,
					oldPassword,
					newPassword
				);
			}
			if (userType === 'admin') {
				user = await AdminService.changePassword(
					email,
					oldPassword,
					newPassword
				);
			}

			if (!user) {
				throw new APIError({
					message: 'Invalid credentials',
					status: 400,
				});
			}

			res.json(
				sendResponse(httpStatus.OK, 'Password change successful', {}, null)
			);
		} catch (err) {
			next(err);
		}
	}

	static async forgotPassword(req: Request, res: Response, next: NextFunction) {
		const userType = req.params.type;
		const { email } = req.body;
		try {
			const user = (await AuthService.getUser(email, userType)) as TAllUsers;
			if (!user) {
				throw new APIError({
					message: 'Invalid credentials',
					status: 400,
				});
			}

			EmailService.sendVerificationMail(user);

			res.json(
				sendResponse(httpStatus.OK, 'Password reset code sent', {}, null)
			);
		} catch (err) {
			next(err);
		}
	}

	static async resetPassword(req: IRequest, res: Response, next: NextFunction) {
		const url = req.url.split('/');
		const userType = url[url.length - 1];
		const { email, resetCode, newPassword } = req.body;

		try {
			const user = (await AuthService.getUser(email, userType)) as TAllUsers;

			if (!user) {
				throw new APIError({
					message: 'Invalid credentials',
					status: 400,
				});
			}

			let referenceModel;
			if (userType === 'user') {
				referenceModel = 'User';
			}
			if (userType === 'admin') {
				referenceModel = 'Admin';
			}

			const codeFound = await OTPCodeService.get({
				code: resetCode,
				user: user._id,
				reference: user._id,
				referenceModel,
			} as FilterQuery<IOTPCode>);

			if (!codeFound) {
				throw new APIError({
					message: 'Invalid or expired code',
					status: 400,
				});
			}

			const { user: userToEdit } = codeFound;

			userToEdit.password = newPassword;
			await userToEdit.save();

			// delete OTP code
			await OTPCodeService.delete(codeFound._id);

			res.json(
				sendResponse(httpStatus.OK, 'Password change successful', {}, null)
			);
		} catch (err) {
			next(err);
		}
	}
}
