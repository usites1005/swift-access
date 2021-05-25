import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import UserAccountService from '../services/userAccount';
import UserService from '../services/user';
import sendResponse from '../common/response';
import APIError from '../common/APIError';
import IRequest from '../types/general';
import { UserAccountPure, IUserAccount } from '../types/userAccount';

/*
A user creates an account. Earning starts the day the user made payment. 
Cycle lasts for 3 weeks (31 days).
Leadership bonus and Referral bonus are paid to the upline when a user registers.
Referral bonus is 3% of the downline's investment, paid to the referrer.
Leadership bonus is 0.5% of the downline's investment, paid to 3 uplines above the referrer.
Every weekday, the admin gets the opportunity to release ROI.
Admin pays withdrawals only on weekends.
*/

export default class UserAccountController {

	static async createUserAccount(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const data = req.body;
      const userId = req.user.id;
      
      // check if the user has an account that is still running
      // 

			// get all users whose contracts have not ended and do this for each user
      const users = UserService.getUsers({});
      (await users).map((user)=>{

      })
			const newEarning = await UserAccountService.create({
				...data,
				type: EarningTypeEnum.ROI,
				userId,
			});

			res.json(
				sendResponse(httpStatus.CREATED, 'UserAccount released successfully', {})
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
  
	static async getUserAccount(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			let userId = req.user.id;

			const account = await UserAccountService.getUserAccount(userId);
			res.json(sendResponse(httpStatus.OK, 'User account found', account));
		} catch (err) {
			next(err);
		}
	}

	// admin
	static async getAllUserAccounts(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const accounts = await UserAccountService.getAllUserAccounts();
			res.json(sendResponse(httpStatus.OK, 'User accounts found', accounts));
		} catch (err) {
			next(err);
		}
	}
}
