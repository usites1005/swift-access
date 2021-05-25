import { Response, NextFunction, Request } from 'express';
import httpStatus from 'http-status';
import dayjs from 'dayjs';
import EarningsService from '../services/earnings';
import UserAccountService from '../services/userAccount';
import sendResponse from '../common/response';
import APIError from '../common/APIError';
import IRequest from '../types/general';
import { EarningTypeEnum } from '../types/earnings';

dayjs().format();

export default class EarningsController {
	static async getUserEarnings(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			let userId = req.user.id;

			const earnings = await EarningsService.getUserEarnings(userId);
			res.json(sendResponse(httpStatus.OK, 'User earnings found', earnings));
		} catch (err) {
			next(err);
		}
	}

	// admin
	static async getAllEarnings(
		_req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const earnings = await EarningsService.getAllEarnings();
			res.json(sendResponse(httpStatus.OK, 'All earnings found', earnings));
		} catch (err) {
			next(err);
		}
	}

	// admin
	static async releaseAllValidUsersROIToday(
		_req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			// get all user accounts whose contracts have not ended and do this for each user
			const userAccounts = await UserAccountService.filterAllUsersAccounts({
				cycleEndDate: { $gte: dayjs() },
			});

			const earnings = userAccounts.map(async (account) => {
				return await EarningsService.create({
					userId: account.userId,
					accountId: account.id,
					type: EarningTypeEnum.ROI,
					amount: account.amountDeposited * 0.01,
					comment: '',
				});
			});

			await Promise.all(earnings);

			res.json(
				sendResponse(httpStatus.CREATED, 'Earnings released successfully', {})
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
