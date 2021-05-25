import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import TransactionsService from '../services/withdrawal';
import UserService from '../services/user';
import sendResponse from '../common/response';
import APIError from '../common/APIError';
import IRequest from '../types/general';
import { TransactionTypeEnum, TransactionsPure } from '../types/withdrawal';

/*
Transactions
User-Deposit
User sends fund to the selected address and fills out deposit form after.
The deposit form data is recorded and pending confirmation from admin.
Once admin confirms, referrer gets 3% R-bonus and 3 other uplines get 0.5% L-bonus.

User-Withdraw
User fills form and awaits payment. Admin confirms that user has enough money and transfers funds and waits for user to confirm.

*/

export default class TransactionsController {
	// user deposit
	static async makeDeposit(req: IRequest, res: Response, next: NextFunction) {
		try {
      let userId = req.user.id;
      // get user and get user account
			const {
				dollarAmount,
				destination,
				sender,
			} = req.body;
			const type = TransactionTypeEnum.DEPOSIT;
			const comment = 'Account deposit';
			const deposit = await TransactionsService.create({
				userId,
				type,
				comment,
				dollarAmount,
				destination,
				sender,
			});
			res.json(sendResponse(httpStatus.OK, 'Deposit sent successfully', deposit));
		} catch (err) {
			next(err);
		}
	}

	// user withdrawal
	static async makeWithdrawal(req: IRequest, res: Response, next: NextFunction) {
		try {
			let userId = req.user.id;
			const {
				dollarAmount,
				destination,
				sender,
			} = req.body;
			const type = TransactionTypeEnum.DEPOSIT;
			const comment = 'Account deposit';
			const deposit = await TransactionsService.create({
				userId,
				type,
				comment,
				dollarAmount,
				destination,
				sender,
			});
			res.json(sendResponse(httpStatus.OK, 'Transaction sent successfully', deposit));
		} catch (err) {
			next(err);
		}
	}

	// admin
	static async getAllEarnings(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const earnings = await TransactionsService.getAllEarnings();
			res.json(sendResponse(httpStatus.OK, 'Users found', earnings));
		} catch (err) {
			next(err);
		}
	}

	// admin
	static async releaseAllUserROI(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const data = req.body;
			const userId = req.user.id;

			// get all users whose contracts have not ended and do this for each user
			const users = UserService.getUsers({});
			const newEarning = await TransactionsService.create({
				...data,
				type: EarningTypeEnum.ROI,
				userId,
			});

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
