import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import APIError from '../common/APIError';
import WithdrawalService from '../services/withdrawal';
import sendResponse from '../common/response';
import IRequest from '../types/general';

export default class WithdrawalController {
	// user withdrawal
	static async makeWithdrawal(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			let { id: userId, btcAddr, ethAddr, tronAddr } = req.user!;

			const { dollarAmount, destinationAddr } = req.body;
			const comment = 'Account withdrawal';
			if (![btcAddr, tronAddr, ethAddr].includes(destinationAddr)) {
				throw new APIError({
					message: `The destination address is not in the user's profile.`,
					status: httpStatus.NOT_FOUND,
				});
			}
			const withdrawalRequest = await WithdrawalService.create({
				userId,
				comment,
				dollarAmount,
				destinationAddr,
			});
			res.json(
				sendResponse(
					httpStatus.OK,
					'Withdrawal request sent successfully to admin',
					withdrawalRequest
				)
			);
		} catch (err) {
			next(err);
		}
	}

	// admin
	static async getAllWithdrawals(
		_req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const withdrawals = await WithdrawalService.getAllWithdrawals({});
			res.json(sendResponse(httpStatus.OK, 'Withdrawals found', withdrawals));
		} catch (err) {
			next(err);
		}
	}

	// admin
	static async updateToPaid(req: IRequest, res: Response, next: NextFunction) {
		try {
			const { userId, withdrawalId } = req.body;
			const withdrawal = await WithdrawalService.updateToPaid({
				userId,
				id: withdrawalId,
			});
			if (!withdrawal) {
				throw new APIError({
					message: 'No withdraw record found with this id',
					status: httpStatus.NOT_FOUND,
				});
			}
			res.json(sendResponse(httpStatus.OK, 'Withdrawal updated', withdrawal));
		} catch (err) {
			next(err);
		}
	}

	// user
	static async getUserWithdrawals(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const userId = req.user!.id;
			const withdrawals = await WithdrawalService.getUserWithdrawals(userId);
			res.json(sendResponse(httpStatus.OK, 'Withdrawals found', withdrawals));
		} catch (err) {
			next(err);
		}
	}
}
