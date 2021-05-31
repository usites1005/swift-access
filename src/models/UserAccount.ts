import { model, Schema, Types } from 'mongoose';
import { IUserAccount } from '../types/userAccount';

const UserAccountSchema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: 'User', required: true },
		amountDeposited: { type: Number, required: true, default: 0 },
		destinationAddr: { type: String, required: true },
		sender: { type: String, required: true },
		cycleEndDate: { type: Date },
	},
	{ timestamps: true }
);

export default model<IUserAccount>('UserAccount', UserAccountSchema);
