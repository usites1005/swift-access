import { Document } from 'mongoose';

export interface IDeposit extends Document {
	id: string;
	userId: string;
	dollarAmount: number;
	destination: string;
	sender: string;
	comment: string;
	// status: string;
	createdAt: string;
	updatedAt: string;
}

export interface DepositPure {
	userId: string;
	dollarAmount: number;
	destination: string;
	sender: string;
	comment: string;
}

// export enum ConfirmationStatusEnum {
// 	PENDING = 'Pending',
// 	PAID = 'Paid',
// 	CONFIRMED = 'Confirmed',
// }