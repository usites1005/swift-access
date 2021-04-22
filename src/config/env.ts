import * as dotenv from 'dotenv';
dotenv.config();

const envVars = JSON.parse(JSON.stringify(process.env));

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,
  emailSecret: envVars.EMAIL_SECRET,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN,
  MONGODB:
    envVars.NODE_ENV === 'test'
      ? envVars.MONGODB_TEST
      : envVars.NODE_ENV === 'development'
      ? envVars.MONGODB_LOCAL
      : envVars.MONGODB_URI,
  serverUrl:
    envVars.NODE_ENV === 'production'
      ? envVars.SERVER_URL
      : envVars.LOCAL_SERVER_URL,
  frontEndUrl:
    envVars.NODE_ENV === 'production'
      ? envVars.FRONT_END_URL_PROD
      : envVars.FRONT_END_URL_DEV,
  SENDGRID_API_KEY: envVars.SENDGRID_API_KEY,
  SENDGRID_AUTHENTICATED_SENDER_EMAIL:
    envVars.SENDGRID_AUTHENTICATED_SENDER_EMAIL,
  VERIFY_EMAIL_TEMPLATE_ID: envVars.VERIFY_EMAIL_TEMPLATE_ID,
  LOGIN_DETAILS_TEMPLATE_ID: envVars.LOGIN_DETAILS_TEMPLATE_ID,
  FORGOT_PASSWORD_TEMPLATE_ID: envVars.FORGOT_PASSWORD_TEMPLATE_ID,
  ORDER_CONFIRMED_MAIL_TEMPLATE_ID: envVars.ORDER_CONFIRMED_MAIL_TEMPLATE_ID,
  OTP_MAIL_TEMPLATE_ID: envVars.OTP_MAIL_TEMPLATE_ID,
  flutterSecertKey: {
    Nigeria: envVars.FLUTTERNIGSK,
    Kenya: envVars.FLUTTERKENSK,
  },
  mailConfig: {
    host: envVars.MAIL_HOST,
    port: envVars.MAIL_PORT,
    auth: {
      user: envVars.MAIL_EMAIL,
      pass: envVars.MAIL_PASS,
    },
  },
  mailSender: envVars.MAIL_SENDER,
};
