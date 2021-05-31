import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../common/response';
import WithdrawalService from '../services/withdrawal';
import EarningsService from '../services/earnings';
import UserAccountService from '../services/userAccount';
import IRequest from '../types/general';
import { EarningTypeEnum } from '../types/earnings';

class AnalyticsController {
	static async getUserData(req: IRequest, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id;
			// const reducer = (accumulator, currentValue) => accumulator + currentValue;

			type UserData = {
				totalDeposits: number;
				totalWithdrawals: number;
				totalEarnings: number;
				totalROI: number;
				totalRBonus: number;
				totalLBonus: number;
				availableBalance: number;
			};

			// get all user accounts and get the total deposits
			const userAccounts = await UserAccountService.getUserAccounts(userId);
			let totalDeposits: number = 0;
			if (userAccounts.length >= 1) {
				totalDeposits = userAccounts.reduce(
					(accumulator, { amountDeposited }) => accumulator + amountDeposited,
					0
				);
			}
			// get all user withdrawals and get the total withdrawals
			const userWithdrawals = await WithdrawalService.getUserWithdrawals(
				userId
			);
			let totalWithdrawals: number = 0;
			if (userWithdrawals.length >= 1) {
				totalWithdrawals = userWithdrawals.reduce(
					(accumulator, { dollarAmount }) => accumulator + dollarAmount,
					0
				);
			}
			// get all user earnings and get the total roi and total r-bonus and total l-bonus
			const userEarnings = await EarningsService.getUserEarnings(userId);
			let totalROI: number = 0;
			let totalRBonus: number = 0;
			let totalLBonus: number = 0;
			if (userEarnings.length >= 1) {
				for (const earning of userEarnings) {
					if (earning.type === EarningTypeEnum.ROI) {
						totalROI += earning.amount;
					} else if (earning.type === EarningTypeEnum.LBONUS) {
						totalLBonus += earning.amount;
					} else if (earning.type === EarningTypeEnum.RBONUS) {
						totalRBonus += earning.amount;
					}
				}
			}

			// total earnings = total roi + total r-bonus + total l-bonus
			const totalEarnings = totalROI + totalRBonus + totalLBonus;

			// available balance = total earnings - total withdrawals ( + capital if total withdrawals is up 50% of deposits)
			let availableBalance: number = 0;
			if (totalWithdrawals >= totalDeposits * 0.5) {
				availableBalance = totalEarnings - totalWithdrawals + totalDeposits;
			} else {
				availableBalance = totalEarnings - totalWithdrawals;
			}

			// userData
			const userData: UserData = {
				totalDeposits,
				totalWithdrawals,
				totalEarnings,
				totalROI,
				totalRBonus,
				totalLBonus,
				availableBalance,
			};

			res.json(
				sendResponse(httpStatus.OK, 'Success', {
					...userData,
				})
			);
		} catch (err) {
			next(err);
		}
	}
}

export default AnalyticsController;
