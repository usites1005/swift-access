import OTPCode from '../models/OTPCode';
import TokenService from './token';
import { IOTPCode } from '../types/otpCode';

export class OTPCodeService {
  deleteUserOTP(data: Partial<IOTPCode>) {
    return OTPCode.findOneAndDelete({ ...data });
  }
  /**
   *
   * @description Deletes a verification
   */
  async delete(id: string) {
    await OTPCode.findByIdAndDelete(id);
  }
  /**
   * @description Creates an account verifier
   */
  async create(data: IOTPCode): Promise<string> {
    let code = await TokenService.generateCode();

    let generate = true;

    const newOTP = new OTPCode(data as IOTPCode);

    while (generate) {
      try {
        // add code to newOTP
        newOTP.code = code;
        await newOTP.save();

        // if no error is thrown, exit loop
        generate = false;
      } catch (error) {
        // if error exist generate new code
        code = TokenService.generateCode();
      }
    }
    return code;
  }

  /**
   * @description gets an account verifier
   */
  async get(data: IOTPCode): Promise<IOTPCode | null> {
    return OTPCode.findOne(data);
  }
}

export default new OTPCodeService();
