import config from '../config/env';
import { IUser } from '../types/user';
import { IAdmin } from '../types/admin';
import sendMail from '../middleware/mailer';
import { confirmTrackingId } from '../mailtemplates/trackingId';
import { otpMail } from '../mailtemplates/OTP';
import { forgotPasswordMail } from '../mailtemplates/forgotpassword';
import { adminLoginDetailsMail } from '../mailtemplates/adminLoginDetails';

const sender = config.SENDGRID_AUTHENTICATED_SENDER_EMAIL;

export default class EmailService {
	public static async sendLoginDetails(user: IAdmin, password: string) {
		// create mail template
		const msg = {
			to: user.email, // Change to your recipient
			from: sender, // Change to your verified sender
			subject: 'Login Details',
			html: adminLoginDetailsMail({
				name: `${user.fullName || 'There'}`,
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
				name: `${user.fullName}`,
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
				name: `${user.fullName}`,
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
			html: confirmTrackingId(user.fullName, trackingId),
		};
		// create mail and send to the user
		return sendMail(msg);
	}

	public static async confirmGiftDeliveryMail(
		user: IUser & string,
		contributor: IUser
	) {
		//const templateID = config.ORDER_CONFIRMED_MAIL_TEMPLATE_ID;
		user;
		// create mail template
		const msg = {
			to: contributor.email, // Change to your recipient
			from: sender, // Change to your verified sender
			subject: 'Gift Delevery',
			html: `<p>Hi ${contributor.fullName}</p> <p>${user.fullName} has been notified of your contribution</p>`,
		};

		// create mail and send to the user
		return sendMail(msg);
	}
}
