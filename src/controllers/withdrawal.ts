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
			let userId = req.user.id;
			const { dollarAmount, destination, sender } = req.body;
			const comment = 'Account withdrawal';
			const withdrawalRequest = await WithdrawalService.create({
				userId,
				comment,
				dollarAmount,
				destination,
				sender,
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
			const withdrawals = await WithdrawalService.getAllWithdrawals();
			res.json(sendResponse(httpStatus.OK, 'Withdrawals found', withdrawals));
		} catch (err) {
			next(err);
		}
	}

	// admin
	static async updateToPaid(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
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
	static async getAllUserWithdrawals(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const userId = req.user?.id;
			const withdrawals = await WithdrawalService.getAllUserWithdrawals(userId);
			res.json(sendResponse(httpStatus.OK, 'Withdrawals found', withdrawals));
		} catch (err) {
			next(err);
		}
	}
}
