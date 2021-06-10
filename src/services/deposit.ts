import DepositModel from '../models/Deposit';
import { DepositPure, DepositStatusEnum } from '../types/deposit';
import dayjs from 'dayjs';

dayjs().format();

export default class DepositService {
	/* user send withdrawal request */
	static async create(data: DepositPure) {
		const newRequest = new DepositModel(data);

		await newRequest.save();
		return newRequest;
	}

	/* CONFIRM DEPOSIT (ADMIN) */
	static async confirmDeposit(id: string) {
		const deposit = DepositModel.findOneAndUpdate(
			{ _id: id },
			{ status: DepositStatusEnum.CONFIRMED, confirmedAt: new Date() },
			{ new: true }
		);

		return deposit;
	}

	/* UNCONFIRMED DEPOSIT (ADMIN) */
	static async unconfirmedDeposit(id: string) {
		const deposit = DepositModel.findOneAndUpdate(
			{ _id: id },
			{ status: DepositStatusEnum.UNCONFIRMED, confirmedAt: new Date() },
			{ new: true }
		);

		return deposit;
	}

	/* GET ALL UNCONFIRMED DEPOSITS */
	static async getUnconfirmedDeposits(userId: string) {
		return DepositModel.find({
			userId,
			status: DepositStatusEnum.CONFIRMED,
		}).sort({ createdAt: -1 });
	}

	/* GET ALL USER DEPOSITS */
	static async getUserDeposits(userId: string) {
		return DepositModel.find({ userId }).sort({ createdAt: -1 });
	}

	/* GET DEPOSIT BY ID */
	static async getDepositById(id: string) {
		return DepositModel.findById(id);
	}

	/* GET WITHDRAWAL BY DESTINATION ADDRESS */
	static async getDepositBySenderAddress(address: string) {
		return DepositModel.findOne({ sender: address });
	}

	/* GET ALL DEPOSIT (ADMIN) */
	static async getAllDeposits(data: {}) {
		return DepositModel.find({ ...data })
			.sort({ createdAt: -1 })
			.populate('userId', 'username email');
	}

	/* QUERY DEPOSIT (ADMIN) */
	static async queryDeposits(query: { [key: string]: any }) {
		return await DepositModel.find({
			...query,
		}).countDocuments();
	}
}
