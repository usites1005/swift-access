import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import AdminService from '../services/admin';
import sendResponse from '../common/response';
import APIError from '../common/APIError';
import config from '../config/env';
import { TokenFor } from '../types/general';
import IRequest from '../types/general';
import TokenService from '../services/token';
import EmailService from '../services/email';
const verificationSecret = config.verificationSecret;

const loginExpiresIn = config.loginExpiresIn;
const loginSecret = config.loginSecret;

export default class AdminController {
	static async getAdmins(req: Request, res: Response, next: NextFunction) {
		try {
			const users = await AdminService.getAdmins(req);
			res.json(sendResponse(httpStatus.OK, 'Admins found', users));
		} catch (err) {
			next(err);
		}
	}

	static async getMe(req: IRequest, res: Response, next: NextFunction) {
		try {
			let _id = req.user?._id;
			const user = await AdminService.getAdmin({ _id });
			if (!user) {
				throw new APIError({
					message: 'Admin not found',
					status: httpStatus.NOT_FOUND,
				});
			}
			res.json(sendResponse(httpStatus.OK, 'Admin found', user));
		} catch (err) {
			next(err);
		}
	}

	static async create(req: IRequest, res: Response, next: NextFunction) {
		try {
			const data = req.body;
			const newAdmin = await AdminService.create({
				...data,
			});

			res.json(
				sendResponse(httpStatus.CREATED, 'Admin created successfully', newAdmin)
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
	static async updateAdmin(req: IRequest, res: Response, next: NextFunction) {
		try {
			const adminId = req.user?._id;
			const id = req.params.adminId;
			const isSuperAdmin = req.user?.isSuper;
			let { isSuper, ...body } = req.body;

			let admin;
			if (isSuperAdmin) {
				admin = await AdminService.updateAdmin({ ...req.body, id });
			} else {
				if (id !== adminId) {
					throw new APIError({
						message: `Unauthorized Admin`,
						status: httpStatus.UNAUTHORIZED,
					});
				}
				admin = await AdminService.updateAdmin({ ...body, id });
			}
			if (!admin) {
				throw new APIError({
					message: 'Admin not found',
					status: httpStatus.NOT_FOUND,
				});
			}
			res.json(sendResponse(httpStatus.OK, 'Admin updated', admin));
		} catch (err) {
			next(err);
		}
	}

	static async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = req.body;

			const user = await AdminService.login(email, password);

			if (!user) {
				throw new APIError({
					message: 'Invalid email or password',
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
		try {
			const { oldPassword, newPassword } = req.body;
			const email = req.user!.email;

			const user = await AdminService.changePassword(
				email,
				oldPassword,
				newPassword
			);

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
			const user = await AdminService.getAdmin({ email });
			if (!user) {
				throw new APIError({
					message: 'Invalid credentials',
					status: 400,
				});
			}

			EmailService.sendForgotPasswordMailAdmin(user.toJSON());

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
			const user = await AdminService.getAdmin({ email: userData.user.email });
			if (!user) {
				throw new APIError({
					message: 'User not found',
					status: 404,
				});
			}
			const { tokenFor } = userData;

			if (email !== user.email) {
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
			user.password = newPassword;
			await user.save();

			const convertUser = user.toJSON();

			const newToken = TokenService.generateToken(
				convertUser,
				loginSecret,
				loginExpiresIn,
				TokenFor.Access
			);

			res.json(
				sendResponse(httpStatus.OK, 'Account verified', user, null, newToken)
			);
		} catch (err) {
			next(err);
		}
	}

	// admin only
	static async toggleAdminActive(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const { adminId } = req.body;
			const requestSender = req.user!;

			if (requestSender.id === adminId) {
				throw new APIError({
					message: 'You cannot deactivate yourself',
					status: httpStatus.FORBIDDEN,
				});
			}

			// Get admin account
			const admin = await AdminService.getAdmin({ _id: adminId });
			if (!admin) {
				throw new APIError({
					message: 'Admin not found',
					status: httpStatus.NOT_FOUND,
				});
			}

			if (admin.isActive) {
				admin.isActive = false;
			} else {
				admin.isActive = true;
			}

			admin.save();

			res.json(
				sendResponse(httpStatus.OK, 'Admin account updated successfully', {})
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
}
