import { FilterQuery } from 'mongoose';
import EarningsModel from '../models/Earnings';
import { IEarnings, EarningsPure } from '../types/earnings';

export default class EarningsService {
	/* CREATE AN EARNING */
	static async create(data: EarningsPure) {
		const newEarnings = new EarningsModel(data);

		await newEarnings.save();
		return newEarnings;
	}

	/* GET ALL USER EARNINGS*/
	static async getUserEarnings(userId: string) {
		return EarningsModel.find({
			userId,
		} as FilterQuery<IEarnings>).sort({ createdAt: -1 });
	}

	/* GET ALL EARNINGS (ADMIN) */
	static async getAllEarnings() {
		return EarningsModel.find().sort({ createdAt: -1 });
	}

	/* QUERY ALL EARNINGS (ADMIN) */
	static async queryEarnings(query: { [key: string]: any }) {
		return await EarningsModel.find({
			...query,
		}).countDocuments();
	}
}
