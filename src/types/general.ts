import { Request } from 'express';

export interface RequestContext {
	req: Request;
}

export enum TokenFor {
	// tokens for sending requests e.g token from login
	Access = 'ACCESS',
	AccountVerification = 'ACCOUNT_VERIFICATION',
	ResetPassword = 'RESET_PASSWORD',
}

export function enumToArray(enumObject: any): string[] {
	const keys: string[] = (Object.values(enumObject) as string[]).filter(
		(key) => key
	);
	return keys;
}
