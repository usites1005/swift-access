import AdminAccountModel from '../models/AdminAccount';
import { AdminAccountPure } from '../types/adminAccount';

export default class UserAccountService {
	/* GET ALL ADMIN ACCOUNTS (ADMIN) */
	static async getAdminAccounts(data: {}) {
		return await AdminAccountModel.find(data).sort({ createdAt: -1 });
	}

	/* GET ADMIN ACCOUNT BY ID (ADMIN) */
	static async getAdminAccountById(id: string) {
		return await AdminAccountModel.findById(id);
	}

	/* CREATE ADMIN CRYPTO ACCOUNT (ADMIN) */
	static async create(data: AdminAccountPure) {
		const newAccount = new AdminAccountModel(data);
		await newAccount.save();
		return newAccount;
	}
}
