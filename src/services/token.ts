import jwt from 'jsonwebtoken';
import { customAlphabet, urlAlphabet } from 'nanoid';
import config from '../config/env';
import { IUser } from '../types/user';
import { IAdmin } from '../types/admin';
import APIError from '../common/APIError';
import httpStatus from 'http-status';

const jwtExpiresIn = config.jwtExpiresIn;
const jwtSecret = config.jwtSecret;

export default class TokenService {
  static generateRegistryCode(): any {
    const nanoid = customAlphabet(urlAlphabet, 10);
    return `${nanoid()}-${nanoid()}`;
  }
  static generateReference(id: string): any {
    const nanoid = customAlphabet(urlAlphabet, 3);
    return `${nanoid()}-${id}-${nanoid()}`;
  }
  public static generateToken(user: IUser & IAdmin, secret?: String) {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role ? user.role : null,
      },
      secret ? secret : jwtSecret,
      {
        expiresIn: jwtExpiresIn,
      },
    );
    return token;
  }

  public static verifyToken(token: string) {
    try {
      return <IUser | IAdmin>jwt.verify(token, jwtSecret);
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
      6,
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
