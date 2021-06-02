import jwt from 'jsonwebtoken';
import { UserPure, IUserToken } from '../types/user';
import { AdminPure } from '../types/admin';
import APIError from '../common/APIError';
import httpStatus from 'http-status';

export default class TokenService {
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
}
