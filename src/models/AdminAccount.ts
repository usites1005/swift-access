import { model, Schema } from 'mongoose';
import { IAdminAccount } from '../types/adminAccount';

const AdminAccountSchema = new Schema(
	{
		adminBTCAddress: { type: String, required: true },
		adminETHAddress: { type: String },
		adminTronAddress: { type: String },
	},
	{ timestamps: true }
);

export default model<IAdminAccount>('AdminAccount', AdminAccountSchema);
