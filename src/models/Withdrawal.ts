import { model, Schema, Types } from 'mongoose';
import { WithdrawalStatusEnum, IWithdrawal } from '../types/withdrawal';
import { enumToArray } from '../types/general';

const WithdrawalsSchema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: 'User', required: true },
		// accountId: { type: Types.ObjectId, ref: 'UserAccount', required: true },
		dollarAmount: { type: Number, required: true },
		destinationAddr: { type: String, required: true },
		comment: { type: String, required: true },
		status: {
			type: String,
			enum: enumToArray(WithdrawalStatusEnum),
			required: true,
			default: WithdrawalStatusEnum.PENDING,
		},
		paidAt: { type: Date },
	},
	{ timestamps: true }
);

export default model<IWithdrawal>('Withdrawals', WithdrawalsSchema);
