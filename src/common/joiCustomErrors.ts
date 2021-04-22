import { ValidationErrorItem } from '@hapi/joi';

/**
 * Returns a custom error object with descriptive messages.
 * @property {Array} arr - Array of Joi validation errors.
 * @returns {Object}
 */

interface IerrMessage {
  [key: string]: string;
}

export default function customErrorMessage(errors: ValidationErrorItem[]) {
  return errors.reduce<IerrMessage>((acc, error) => {
    const [key] = error.path;
    acc[key] = error.message.replace(/"/g, '');

    if (key === 'phone') acc[key] = 'Phone number must be a valid number!';
    if (key === 'userType') acc[key] = 'URL is incorrect';
    return acc;
  }, {});
}
