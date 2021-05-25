import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import EarningsService from '../services/earnings';
import UserService from '../services/user';
import sendResponse from '../common/response';
import APIError from '../common/APIError';
import IRequest from '../types/general';
import { EarningTypeEnum } from '../types/earnings';

/*
A user creates an account. Earning starts the day the user made payment. 
Cycle lasts for 3 weeks (31 days).
Leadership bonus and Referral bonus are paid to the upline when a user registers.
Referral bonus is 3% of the downline's investment, paid to the referrer.
Leadership bonus is 0.5% of the downline's investment, paid to 3 uplines above the referrer.
Every weekday, the admin gets the opportunity to release ROI.
Admin pays withdrawals only on weekends.
*/

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
		req: IRequest,
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
      (await users).map((user)=>{

      })
			const newEarning = await EarningsService.create({
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
