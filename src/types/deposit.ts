import { Document } from 'mongoose';

export interface IDeposit extends Document {
	id: string;
	userId: string;
	amountDeposited: number;
	destinationAddr: string;
	sender: string;
	status: string;
	confirmedAt: Date;
	createdAt: string;
	updatedAt: string;
}

export interface DepositPure {
	userId: string;
	amountDeposited: number;
	destinationAddr: string;
	sender: string;
}

export enum DepositStatusEnum {
	PENDING = 'Pending',
	CONFIRMED = 'Confirmed',
	UNCONFIRMED = 'Unconfirmed',
}
