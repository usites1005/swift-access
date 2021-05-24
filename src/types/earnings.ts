import { Document } from 'mongoose';

export interface IEarnings extends Document {
	id: string;
	userId: string;
	type: string;
	amount: number;
	comment: string;
	createdAt: string;
	updatedAt: string;
}

export interface EarningsPure {
	id?: string;
	userId: string;
	type: string;
	amount: number;
	comment: string;
}

export enum EarningTypeEnum {
	LBONUS = 'L Bonus',
	RBONUS = 'R Bonus',
	ROI = 'ROI',
}
