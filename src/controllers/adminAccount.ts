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
	static async addCoinAddress(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {      
			const { adminBTCAddress, adminETHAddress, adminTronAddress } = req.body;
			// check if the user has that coin already added
			const adminAccounts = await AdminAccountService.getAdminAccounts();
			if (adminAccounts.length < 1) {
				await AdminAccountService.create({
					adminBTCAddress,
					adminETHAddress,
					adminTronAddress,
				});
			} else {
				if (adminBTCAddress && adminAccounts[0].adminBTCAddress) {
					throw new APIError({
						message: 'You already have set a BTC address.',
						status: httpStatus.FORBIDDEN,
					});
				}

				if (adminETHAddress && adminAccounts[0].adminETHAddress) {
					throw new APIError({
						message: 'You already have set an ETH address.',
						status: httpStatus.FORBIDDEN,
					});
				}

				if (adminTronAddress && adminAccounts[0].adminTronAddress) {
					throw new APIError({
						message: 'You already have set a TRON address.',
						status: httpStatus.FORBIDDEN,
					});
				}

				adminAccounts[0].adminBTCAddress =
					adminBTCAddress || adminAccounts[0].adminBTCAddress;
				adminAccounts[0].adminETHAddress =
					adminETHAddress || adminAccounts[0].adminETHAddress;
				adminAccounts[0].adminTronAddress =
					adminTronAddress || adminAccounts[0].adminTronAddress;

				adminAccounts[0].save();
			}

			res.json(sendResponse(httpStatus.OK, 'Admin address account updated', adminAccounts[0]));
		} catch (err) {
			next(err);
		}
	}

	// all users
	static async getAdminAccounts(
		_req: IRequest,
		res: Response,
		next: NextFunction
	) {    
		try {
			const account = await AdminAccountService.getAdminAccounts();
			res.json(
				sendResponse(httpStatus.OK, 'Admin address account found', account[0])
			);
		} catch (err) {
			next(err);
		}
	}
}
