import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import UserService from '../services/user';
import UserAccountService from '../services/userAccount';
import DepositService from '../services/deposit';
import sendResponse from '../common/response';
import APIError from '../common/APIError';
import IRequest from '../types/general';
import { getEndDate } from '../common/dates';
import EarningsService from '../services/earnings';
import { EarningTypeEnum } from '../types/earnings';

export default class UserAccountController {
	// admin only
	static async createUserAccount(
		req: IRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const { depositId } = req.body;

			// update the deposit request to confirmed
			const deposit = await DepositService.confirmDeposit(depositId);
			if (!deposit) {
				throw new APIError({
					message: 'Deposit request not found',
					status: httpStatus.NOT_FOUND,
				});
			}

			const user = await UserService.getUser({ _id: deposit.userId });

			if (!user) {
				throw new APIError({
					message: 'User not found',
					status: httpStatus.NOT_FOUND,
				});
			}

			const cycleEndDate = getEndDate();

			// create new user account
			const newAccount = await UserAccountService.create({
				userId: deposit.userId,
				destinationAddr: deposit.destinationAddr,
				sender: deposit.sender,
				amountDeposited: deposit.amountDeposited,
				cycleEndDate,
			});

			// fund referrer and leaders accounts
			// get referrer and add R Bonus  to their earnings
			const referral1 = await UserService.getUser({ username: user.refBy });

			if (referral1) {
				await EarningsService.create({
					userId: referral1._id,
					type: EarningTypeEnum.RBONUS,
					amount: newAccount.amountDeposited * 0.03,
					comment: `From ${user.username}`,
				});

				// get referral1's referrer and add L Bonus to their earnings
				const referral2 = await UserService.getUser({
					username: referral1.refBy,
				});
				if (referral2) {
					await EarningsService.create({
						userId: referral2._id,
						type: EarningTypeEnum.LBONUS,
						amount: newAccount.amountDeposited * 0.005,
						comment: `From ${user.username}`,
					});

					// get referral2's referrer and add L Bonus to their earnings
					const referral3 = await UserService.getUser({
						username: referral2.refBy,
					});
					if (referral3) {
						await EarningsService.create({
							userId: referral3._id,
							type: EarningTypeEnum.LBONUS,
							amount: newAccount.amountDeposited * 0.005,
							comment: `From ${user.username}`,
						});

						// get referral3's referrer and add L Bonus to their earnings
						const referral4 = await UserService.getUser({
							username: referral3.refBy,
						});
						if (referral4) {
							await EarningsService.create({
								userId: referral4._id,
								type: EarningTypeEnum.LBONUS,
								amount: newAccount.amountDeposited * 0.005,
								comment: `From ${user.username}`,
							});
						}
					}
				}
			}

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
	static async getAllUsersAccounts(
		_req: IRequest,
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
