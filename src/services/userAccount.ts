import { FilterQuery } from 'mongoose';
import UserAccountModel from '../models/UserAccount';
import { UserAccountPure, IUserAccount } from '../types/userAccount';

export default class UserAccountService {
	/* GET ALL USER ACCOUNTS*/
	static async getUserAccounts(userId: string) {    
		return await UserAccountModel.find({
			userId,
		} as FilterQuery<IUserAccount>).sort({ createdAt: -1 });
	}

	/* CREATE A USER DEPOSIT ACCOUNT (ADMIN) */
	static async create(data: UserAccountPure) {
		const newUserAccount = new UserAccountModel(data);
		await newUserAccount.save();
		return newUserAccount;
	}

	/* GET ALL ACCOUNTS (ADMIN) */
	static async getAllUsersAccounts() {
		return await UserAccountModel.find().sort({ createdAt: -1 }).populate('userId', 'username email');
	}

	/* QUERY ALL  ACCOUNTS (ADMIN) */
	static async filterAllUsersAccounts(query: { [key: string]: any }) {
		return await UserAccountModel.find({ ...query }).sort({ createdAt: -1 });
	}
}
