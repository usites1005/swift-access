import { model, Schema, Types } from 'mongoose';
import { IEarnings, EarningTypeEnum } from '../types/earnings';
import { enumToArray } from '../types/general';

const EarningsSchema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: 'User', required: true },
		accountId: { type: Types.ObjectId, ref: 'UserAccount' },
		type: {
			type: String,
			enum: enumToArray(EarningTypeEnum),
			required: true,
		},
		amount: { type: Number, required: true },
		comment: { type: String, required: true },
	},
	{ timestamps: true }
);

export default model<IEarnings>('Earnings', EarningsSchema);
