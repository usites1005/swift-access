import { Document } from 'mongoose';

export interface ITransactionsHistory extends Document {
	id: string;
	type: string;
	currency: string;
	amount: number;
	coinAmount: number;
	destination: string;
	sender: string;
	comment: string;
	status: string;
	deleted: boolean;
	confirmedAt: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string;
}

export enum DeliveryStatusEnum {
	PENDING = 'Pending',
	CONFIRMED = 'Confirmed',
}

