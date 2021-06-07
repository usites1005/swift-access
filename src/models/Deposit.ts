import { model, Schema, Types } from 'mongoose';
import { DepositStatusEnum, IDeposit } from '../types/deposit';
import { enumToArray } from '../types/general';

const DepositsSchema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: 'User', required: true },
		amountDeposited: { type: Number, required: true },
		destinationAddr: { type: String, required: true },
		sender: { type: String, required: true },
		status: {
			type: String,
			enum: enumToArray(DepositStatusEnum),
			required: true,
			default: DepositStatusEnum.PENDING,
		},
		confirmedAt: { type: Date },
	},
	{ timestamps: true }
);

export default model<IDeposit>('Deposit', DepositsSchema);
