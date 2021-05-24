import sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import config from '../config/env';
import { IUser, UserPure } from '../types/user';
// import { confirmTrackingId } from '../mailTemplates/trackingId';
import TokenService from '../services/token';
import { TokenFor } from '../types/general';

// import { forgotPasswordMail } from '../mailTemplates/forgotPassword';
// import { adminLoginDetailsMail } from '../mailTemplates/adminLoginDetails';

const sender = config.SENDGRID_AUTHENTICATED_SENDER_EMAIL;
const verificationExpiresIn = config.verificationExpiresIn;
const verificationSecret = config.verificationSecret;

sgMail.setApiKey(config.SENDGRID_API_KEY);

function generateMessageTemplate(
	from: string,
	to: string,
	templateData: Record<string, unknown>,
	templateId: string
): MailDataRequired {
	return {
		from,
		personalizations: [
			{
				to: [{ email: to }],
				dynamicTemplateData: templateData,
			},
		],
		templateId,
	};
}

async function sendMail(msg: MailDataRequired) {
	try {
		await sgMail.send({
			...msg,
			mailSettings: {
				sandboxMode: { enable: config.env === 'test' ? true : false },
			},
		});
	} catch (error) {
		console.log(error);
		return error;
	}
}
export default class EmailService {
	public static async sendForgotPasswordMail(user: IUser, code: string) {
    console.log(user, code);
    
		// create mail template
		// const msg = {
		// 	to: user.email, // Change to your recipient
		// 	from: sender, // Change to your verified sender
		// 	subject: 'Password Reset',
		// 	html: forgotPasswordMail({
		// 		name: `${user.fullName}`,
		// 		resetCode: code,
		// 	}),
		// };
		// // create mail and send to the user
		// return sendMail(msg);
	}

	public static async sendVerificationMail(user: UserPure) {    
		const token = TokenService.generateToken(
			{ ...user },
			verificationSecret,
			verificationExpiresIn,
			TokenFor.AccountVerification
		);

		const msg = generateMessageTemplate(
			sender,
			user!.email,
			{
				name: user?.fullName,
				verificationLink: `${config.frontEndUrl}/auth/verify?verificationToken=${token}`,
				message:
					"You are getting this mail because you signed up on Swift Access Trade. Kindly ignore if you didn't.",
			},
			config.VERIFY_EMAIL_TEMPLATE_ID
		);
		return await sendMail(msg);
	}
}
