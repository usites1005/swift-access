import { FilterQuery } from 'mongoose';
import UserAccountModel from '../models/UserAccount';
import { UserAccountPure, IUserAccount } from '../types/userAccount';

export default class UserAccountService {
	/* CREATE AN ACCOUNT */
	// user can have multiple accounts created at the time of deposit. New accounts can only be created when the last one has been completed
	static async create(data: UserAccountPure) {
		// check if user has an account
		const accountExists = await UserAccountModel.findOne({
			userId: data.userId,
			cycleCompleted: false,
		} as FilterQuery<IUserAccount>);

		if (accountExists) {
			// throw error
		}
		const newUserAccount = new UserAccountModel(data);

		await newUserAccount.save();
		return newUserAccount;
	}

	/* GET ALL USER ACCOUNTS*/
	static async getUserAccount(userId: string) {
		return await UserAccountModel.findOne({
			userId,
		} as FilterQuery<IUserAccount>);
	}

	/* GET ALL ACCOUNTS (ADMIN) */
	static async getAllUserAccounts() {
		return await UserAccountModel.find().sort({ createdAt: -1 });
	}

	/* QUERY ALL ACCOUNTS (ADMIN) */
	static async queryUserAccount(query: { [key: string]: any }) {
		return await UserAccountModel.find({
			...query,
		}).countDocuments();
	}
}
