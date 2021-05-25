import WithdrawalModel from '../models/Withdrawal';
import {
	WithdrawalPure,
	WithdrawalStatusEnum,
	IWithdrawal,
} from '../types/withdrawal';

export default class TransactionsService {
	/* user send withdrawal request */
	static async create(data: WithdrawalPure) {
		const newRequest = new WithdrawalModel(data);

		await newRequest.save();
		return newRequest;
	}

	/* UPDATE WITHDRAWAL (ADMIN) */
	static async updateToPaid({ userId, id }: Partial<IWithdrawal>) {
		const withdrawal = WithdrawalModel.findOneAndUpdate(
			{ _id: id, userId },
			{ status: WithdrawalStatusEnum.PAID },
			{ new: true }
		);

		return withdrawal;
	}

	/* GET ALL USER WITHDRAWALS */
	static async getAllUserWithdrawals(userId: string) {
		return WithdrawalModel.find({ userId }).sort({ createdAt: -1 });
	}

	/* GET WITHDRAWAL BY ID */
	static async getWithdrawalById(id: string) {
		return WithdrawalModel.findById(id);
	}

	/* GET WITHDRAWAL BY DESTINATION ADDRESS */
	static async getWithdrawalByDestinationAddress(address: string) {
		return WithdrawalModel.findOne({ destination: address });
	}

	/* GET ALL WITHDRAWALS (ADMIN) */
	static async getAllWithdrawals() {
		return WithdrawalModel.find().sort({ createdAt: -1 });
	}

	/* QUERY WITHDRAWALS (ADMIN) */
	static async queryWithdrawals(query: { [key: string]: any }) {
		return await WithdrawalModel.find({
			...query,
		}).countDocuments();
	}
}
