import { model, Schema, Types } from 'mongoose';
import { ITransactions, ConfirmationStatusEnum } from '../types/transactions';
import { enumToArray } from '../types/general';

const TransactionsSchema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: 'User', required: true },
		type: { type: String, required: true },
		currency: { type: String, required: true },
		amount: { type: Number, required: true },
		coinAmount: { type: Number, required: true },
		destination: { type: String, required: true },
		sender: { type: String, required: true },
		comment: { type: String, required: true },
		status: {
			type: String,
			enum: enumToArray(ConfirmationStatusEnum),
			required: true,
			default: ConfirmationStatusEnum.PENDING,
		},
		confirmedAt: { type: Date },
	},
	{ timestamps: true }
);

export default model<ITransactions>('Transactions', TransactionsSchema);
