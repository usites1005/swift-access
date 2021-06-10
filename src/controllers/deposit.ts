import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import APIError from '../common/APIError';
import DepositService from '../services/deposit';
import { DepositStatusEnum } from '../types/deposit';
import AdminAccountService from '../services/adminAccount';
import sendResponse from '../common/response';
import IRequest from '../types/general';

export default class DepositController {
	// user only
	static async makeDeposit(req: IRequest, res: Response, next: NextFunction) {
		try {
			let { id: userId } = req.user!;
			const { sender, destinationAddr, amountDeposited } = req.body;

			// Get admin account
			const adminAccount = await AdminAccountService.getAdminAccounts({
				address: destinationAddr,
			});

			if (adminAccount.length < 1) {
				throw new APIError({
					message: 'Admin address not found. Please check the address again.',
					status: httpStatus.NOT_FOUND,
				});
			}

			// create deposit request
			const depositRequest = await DepositService.create({
				userId,
				amountDeposited,
				destinationAddr,
				sender,
			});
			res.json(
				sendResponse(
					httpStatus.OK,
					'Deposit request sent successfully to admin',
					depositRequest
				)
			);
		} catch (err) {
			next(err);
		}
	}

	// admin
	static async getAllDeposits(
		_req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const deposits = await DepositService.getAllDeposits({});
			res.json(sendResponse(httpStatus.OK, 'Deposits found', deposits));
		} catch (err) {
			next(err);
		}
	}

	// admin
	static async getAllUnconfirmedDeposits(
		_req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const deposits = await DepositService.getAllDeposits({
				status: DepositStatusEnum.UNCONFIRMED,
			});
			res.json(sendResponse(httpStatus.OK, 'Deposits found', deposits));
		} catch (err) {
			next(err);
		}
	}

	// admin
	static async unconfirmedDeposit(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const { depositId } = req.body;
			const deposit = await DepositService.unconfirmedDeposit(depositId);
			if (!deposit) {
				throw new APIError({
					message: 'No deposit request found with this id',
					status: httpStatus.NOT_FOUND,
				});
			}
			res.json(sendResponse(httpStatus.OK, 'Deposit updated', deposit));
		} catch (err) {
			next(err);
		}
	}

	// user
	static async getUserDeposits(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const userId = req.user!.id;
			const deposits = await DepositService.getUserDeposits(userId);
			res.json(sendResponse(httpStatus.OK, 'Deposits found', deposits));
		} catch (err) {
			next(err);
		}
	}
}
