import { model, Schema, Types } from 'mongoose';
import { IAdminAccount, CurrencyEnum } from '../types/adminAccount';
import { enumToArray } from '../types/general';

const AdminAccountSchema = new Schema(
	{
		adminId: { type: Types.ObjectId, ref: 'Admin', required: true },
		currency: {
			type: String,
			enum: enumToArray(CurrencyEnum),
			required: true,
		},
		address: { type: String, required: true },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

export default model<IAdminAccount>('AdminAccount', AdminAccountSchema);
