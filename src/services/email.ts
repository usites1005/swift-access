import config from '../config/env';
import { IUser } from '../types/user';
import { IAdmin } from '../types/admin';
import sendMail from '../middleware/mailer';
import { confirmTrackingId } from '../mailtemplates/trackingId';
import { otpMail } from '../mailtemplates/OTP';
import { forgotPasswordMail } from '../mailtemplates/forgotpassword';
import { adminLoginDetailsMail } from '../mailtemplates/adminLoginDetails';
import { contributionAlertMail } from '../mailtemplates/contributionAlert';
import { ITransaction, CurrencyEnumType } from '../types/transaction';

const sender = config.SENDGRID_AUTHENTICATED_SENDER_EMAIL;

export default class EmailService {
  public static async sendLoginDetails(user: IAdmin, password: string) {
    // create mail template
    const msg = {
      to: user.email, // Change to your recipient
      from: sender, // Change to your verified sender
      subject: 'Login Details',
      html: adminLoginDetailsMail({
        name: `${user.firstName || 'There'}`,
        password,
      }),
    };
    // create mail and send to the user
    return sendMail(msg);
  }

  public static async sendForgotPasswordMail(user: IUser, code: string) {
    // create mail template

    const msg = {
      to: user.email, // Change to your recipient
      from: sender, // Change to your verified sender
      subject: 'Password Reset',
      html: forgotPasswordMail({
        name: `${user.firstName}`,
        resetCode: code,
      }),
    };
    // create mail and send to the user
    return sendMail(msg);
  }

  public static async sendOTPMail(user: IUser, message: string, otp: string) {
    // create mail template

    const msg = {
      to: user.email, // Change to your recipient
      from: sender, // Change to your verified sender
      subject: 'Bliss Group: Your OTP',
      html: otpMail({
        name: `${user.firstName}`,
        message,
        otp,
      }),
    };
    // create mail and send to the user
    return sendMail(msg);
  }

  public static async sendOrderConfirmedMail(user: IUser, trackingId: string) {
    const msg = {
      to: user.email, // Change to your recipient
      from: sender, // Change to your verified sender
      subject: 'Order Confirmed!',
      html: confirmTrackingId(user.firstName, trackingId),
    };
    // create mail and send to the user
    return sendMail(msg);
  }

  public static async confirmGiftDeliveryMail(
    user: IUser & string,
    contributor: IUser,
  ) {
    //const templateID = config.ORDER_CONFIRMED_MAIL_TEMPLATE_ID;
    user;
    // create mail template
    const msg = {
      to: contributor.email, // Change to your recipient
      from: sender, // Change to your verified sender
      subject: 'Gift Delevery',
      html: `<p>Hi ${contributor.firstName}</p> <p>${user.firstName} has been notified of your contribution</p>`,
    };

    // create mail and send to the user
    return sendMail(msg);
  }

  public static async contributionAlert(transaction: ITransaction) {
    const user = transaction.registry.user as IUser;
    const currency = CurrencyEnumType[transaction.location];
    // create mail template
    const msg = {
      to: user.email, // Change to your recipient
      from: sender, // Change to your verified sender
      subject: 'Contribution Alert',
      html: contributionAlertMail({
        name: `${user.firstName || 'There'}`,
        contributor: `${transaction.userData.firstName} ${
          transaction.userData.lastName || ''
        }`,
        balance: transaction.registry.amount,
        currency,
        amount: transaction.amount,
      }),
    };
    // create mail and send to the user
    return sendMail(msg);
  }
}
