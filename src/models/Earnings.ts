import { model, Schema, Types } from 'mongoose';
import { IEarnings } from '../types/earnings';

const EarningsSchema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: 'User', required: true },
		type: { type: String, required: true },
		amount: { type: Number, required: true },
		comment: { type: String, required: true },
	},
	{ timestamps: true }
);

export default model<IEarnings>('Earnings', EarningsSchema);
