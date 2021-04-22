import UserModel from '../models/User';
import AdminModel from '../models/Admin';

export default class AuthService {
  /* GET USER */
  static async getUser(email: string, userType: string) {
    let user;
    if (userType === 'user') {
      user = await UserModel.findOne({
        email,
        isVerified: true,
        deleted: false,
      });
    }
    if (userType === 'admin') {
      user = await AdminModel.findOne({
        email,
        deleted: false,
      });
    }
    if (!user) {
      return null;
    }
    return user;
  }
}
