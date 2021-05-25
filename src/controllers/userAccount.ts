import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import UserAccountService from '../services/userAccount';
import sendResponse from '../common/response';
import APIError from '../common/APIError';
import IRequest from '../types/general';
import { getEndDate } from '../common/dates';

export default class UserAccountController {
  // admin only
	static async createUserAccount(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const data = req.body;
			const cycleEndDate = getEndDate();

			const newAccount = await UserAccountService.create({
				...data,
				cycleEndDate,
				userId: data.userId,
			});

			res.json(
				sendResponse(
					httpStatus.CREATED,
					'User account created successfully',
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

	static async getUserAccounts(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			let userId = req.user!.id;

			const account = await UserAccountService.getUserAccounts(userId);
			res.json(sendResponse(httpStatus.OK, 'User accounts found', account));
		} catch (err) {
			next(err);
		}
	}

	// admin
	static async getAllUserAccounts(
		_req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const accounts = await UserAccountService.getAllUsersAccounts();
			res.json(sendResponse(httpStatus.OK, 'Users accounts found', accounts));
		} catch (err) {
			next(err);
		}
	}
}
