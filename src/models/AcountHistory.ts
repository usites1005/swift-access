import { model, Schema, Types } from 'mongoose';
import { IAccountHistory } from '../types/accountHistory';

const AccountHistorySchema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: 'User', required: true },
		type: { type: String, required: true },
		amount: { type: Number, required: true },
		comment: { type: String, required: true },
	},
	{ timestamps: true }
);

export default model<IAccountHistory>('AccountHistory', AccountHistorySchema);
