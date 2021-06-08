import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import AdminAccountService from '../services/adminAccount';
import sendResponse from '../common/response';
import APIError from '../common/APIError';
import IRequest from '../types/general';

export default class AdminAccountController {
	// admin only
	static async addCoinAddress(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const adminId = req.user!.id;
			const { currency, address } = req.body;

      // todo: do not automatically deactivate addresses, allow admin to do it manually
			// // Get admin admin account
			// const currencyAccounts = await AdminAccountService.getAdminAccounts({
			// 	currency,
			// });

			// if (currencyAccounts.length > 0) {
			// 	// deactivate other accounts of the same currency
			// 	currencyAccounts.forEach((account) => account.isActive === false);
			// }

			// create a new account
			const newAccount = await AdminAccountService.create({
				currency,
				address,
				adminId,
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

	// admin Only
	static async getAdminAccounts(
		_req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			let accounts;
			accounts = await AdminAccountService.getAdminAccounts({});
			// todo: find the response to send to frontend when admin has no account set
			if (accounts.length === 0) {
				accounts = [{}];
			}
			res.json(
				sendResponse(httpStatus.OK, 'Admin addresses found', accounts)
			);
		} catch (err) {
			next(err);
		}
	}

	// all users
	static async getActiveAdminAccounts(
		_req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			let accounts;
			accounts = await AdminAccountService.getAdminAccounts({ isActive: true });
			if (accounts.length === 0) {
				accounts = [{}];
			}
			res.json(
				sendResponse(httpStatus.OK, 'Admin address account found', accounts)
			);
		} catch (err) {
			next(err);
		}
	}
}
