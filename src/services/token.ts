import jwt from 'jsonwebtoken';
import { customAlphabet, urlAlphabet } from 'nanoid';
import { UserPure, IUserToken } from '../types/user';
import { AdminPure } from '../types/admin';
import APIError from '../common/APIError';
import httpStatus from 'http-status';

export default class TokenService {
	static generateRegistryCode(): any {
		const nanoid = customAlphabet(urlAlphabet, 10);
		return `${nanoid()}-${nanoid()}`;
	}
	static generateReference(id: string): any {
		const nanoid = customAlphabet(urlAlphabet, 3);
		return `${nanoid()}-${id}-${nanoid()}`;
	}
	public static generateToken(
		user: Partial<UserPure> | Partial<AdminPure>,
		jwtSecret: string,
		expiresIn: string,
		tokenFor: string
	) {
		const token = jwt.sign(
			{
				user,
				tokenFor,
			},
			jwtSecret,
			{
				expiresIn,
			}
		);
		return token;
	}

	public static verifyToken(token: string, jwtSecret: string) {
		try {
			return <IUserToken>jwt.verify(token, jwtSecret);
		} catch (err) {
			throw new APIError({
				message: 'Unauthorized User',
				status: httpStatus.UNAUTHORIZED,
			});
		}
	}

	public static generateCode() {
		const nanoid = customAlphabet(
			'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz',
			6
		);
		return nanoid();
	}

	public static generateTrackingId() {
		const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);
		const code = nanoid();
		const date = new Date();
		const dateArray = date.toISOString().split('-');

		const dateCode =
			dateArray[0] + dateArray[1] + dateArray[2][0] + dateArray[2][1];
		const trackingId = code + dateCode;
		return trackingId;
	}
}
