import { model, Schema, Types } from 'mongoose';
import { IUserAccount } from '../types/userAccount';

const UserAccountSchema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: 'User', required: true },
		amountDeposited: { type: Number, required: true, default: 0 },
		earnedROI: { type: Number, required: true, default: 0 },
		referralBonus: { type: Number, required: true, default: 0 },
		leadershipBonus: { type: Number, required: true, default: 0 },
		totalWithdrawal: { type: Number, required: true, default: 0 },
		accountBalance: { type: Number, required: true, default: 0 },
		cycleCompleted: { type: Boolean, required: true, default: false },
		depositDate: { type: Date },
	},
	{ timestamps: true }
);

export default model<IUserAccount>('UserAccount', UserAccountSchema);
