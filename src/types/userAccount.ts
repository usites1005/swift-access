import { Document } from 'mongoose';

export interface IUserAccount extends Document {
	id: string;
	userId: string;
	amountDeposited: number;
	destinationAddr: string;
	sender: string;
	cycleEndDate: string;
	createdAt: string;
	updatedAt: string;
}

export interface UserAccountPure {
	userId: string;
	amountDeposited: number;
	destinationAddr: string;
	sender: string;
}
