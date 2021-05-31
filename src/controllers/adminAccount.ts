import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import AdminAccountService from '../services/adminAccount';
import sendResponse from '../common/response';
import APIError from '../common/APIError';
import IRequest from '../types/general';

export default class AdminAccountController {
	// admin only
	static async createAdminAccount(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const data = req.body;

			// Get admin admin account
			const adminAccount = await AdminAccountService.getAdminAccounts();

			if (adminAccount.length > 0) {
				throw new APIError({
					message: `Admin already has an account with crypto addresses`,
					status: httpStatus.FORBIDDEN,
				});
			}

			const newAccount = await AdminAccountService.create({
				...data,
			});

			res.json(
				sendResponse(
					httpStatus.CREATED,
					'Admin address account created successfully',
					newAccount
				)
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

	// admin
	static async getAdminAccounts(
		_req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const account = await AdminAccountService.getAdminAccounts();
			res.json(sendResponse(httpStatus.OK, 'Admin address account found', account[0]));
		} catch (err) {
			next(err);
		}
	}
}
