import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import UserService from '../services/user';
import AdminService from '../services/admin';
import TokenService from '../services/token';
import config from '../config/env';
import sendResponse from '../common/response';
import APIError from '../common/APIError';
import IRequest from '../types/expressTypes';
import EmailService from '../services/email';
import { TokenFor } from '../types/general';
import UserModel from '../models/User';

const loginExpiresIn = config.loginExpiresIn;
const loginSecret = config.loginSecret;
const verificationSecret = config.verificationSecret;

export default class AuthController {
	static async resendVerificationMail(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const { email } = req.body;
			let user = await UserService.getUser({ email });
			if (!user) {
				throw new APIError({
					message: 'User not found',
					status: httpStatus.NOT_FOUND,
				});
			}
			// send account verification to user
			EmailService.sendVerificationMail(user.toJSON());

			res
				.status(httpStatus.OK)
				.json(sendResponse(httpStatus.OK, 'Token sent', {}));
		} catch (err) {
			next(err);
		}
	}

	static async verifyEmail(req: Request, res: Response, next: NextFunction) {
		try {
			const { token } = req.body;

			const userData = TokenService.verifyToken(token, verificationSecret);
			const { user: verifiedUser, tokenFor } = userData;

			if (tokenFor !== TokenFor.AccountVerification) {
				throw new APIError({
					message: 'Invalid or expired token',
					status: 400,
				});
			}

			const user = await UserModel.findOne({ email: verifiedUser.email });

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
			const convertUser = user.toJSON();

			const newToken = TokenService.generateToken(
				convertUser,
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
		try {
			const { email, password } = req.body;

			const user = await UserService.login(email, password);

			if (!user) {
				throw new APIError({
					message: 'Invalid email or password',
					status: 400,
				});
			}
			if (!user.isVerified) {
				// send account verification to user
				EmailService.sendVerificationMail(user.toJSON());
				throw new APIError({
					message: 'Please verify your account with the email sent to you.',
					status: 400,
				});
			}
			const convertUser = user.toJSON();

			const token = TokenService.generateToken(
				convertUser,
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
		const { email } = req.body;
		try {
			const user = await UserService.getUser({ email });
			if (!user) {
				throw new APIError({
					message: 'Invalid credentials',
					status: 400,
				});
			}

			// todo: change this to password reset mail
			EmailService.sendVerificationMail(user.toJSON());

			res.json(
				sendResponse(httpStatus.OK, 'Password reset code sent', {}, null)
			);
		} catch (err) {
			next(err);
		}
	}

	static async resetPassword(req: Request, res: Response, next: NextFunction) {
		const { email, resetToken, newPassword } = req.body;

		try {
			const userData = TokenService.verifyToken(resetToken, verificationSecret);

			const { user: userToEdit, tokenFor } = userData;

			if (email !== userToEdit.email) {
				throw new APIError({
					message: 'Unauthorized User',
					status: 400,
				});
			}

			if (tokenFor !== TokenFor.ResetPassword) {
				throw new APIError({
					message: 'Invalid or expired token',
					status: 400,
				});
			}
			userToEdit.password = newPassword;
			await userToEdit.save();

			res.json(
				sendResponse(httpStatus.OK, 'Password change successful', {}, null)
			);
		} catch (err) {
			next(err);
		}
	}
}
