const nodemailer = require('nodemailer');
import config from '../config/env';

const from = config.mailSender;
const smtpTransport = nodemailer.createTransport({
  ...config.mailConfig,
  pool: true, // use pooled connection
  rateLimit: true, // enable to make sure we are limiting
  maxConnections: 3, // set limit to 3 connection
  maxMessages: 5, // send 5 emails per second
});

export default async function sendMail(msg: {}) {
  try {
    smtpTransport.sendMail({ ...{ ...msg, from } }, (err?: string) => {
      if (err) {
        return new Error(err);
      }
      return;
    });
    return { message: 'mail sent successfully' };
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
    return { message: 'mail sending failed' };
  }
}
