import TransactionsModel from '../models/Withdrawal';
import { TransactionsPure , ConfirmationStatusEnum, TransactionTypeEnum} from '../types/withdrawal';

export default class TransactionsService {
	/* SEND */
	static async create(data: TransactionsPure) {
		const newTransaction = new TransactionsModel(data);

		await newTransaction.save();
		return newTransaction;
	}

	/* RECEIVE */
	static async receive(data: TransactionsPure) {
		const newEarnings = new TransactionsModel(data);

		await newEarnings.save();
		return newEarnings;
	}

	/* GET ALL TRANSACTIONS (ADMIN) */
	static async getAllEarnings() {
		return TransactionsModel.find().sort({ createdAt: -1 });
	}

	/* UPDATE TRANSACTION (ADMIN) */
	static async queryEarnings(query: { [key: string]: any }) {
		return await TransactionsModel.find({
			...query,
		}).countDocuments();
	}
}
