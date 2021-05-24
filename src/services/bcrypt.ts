import bcrypt from 'bcryptjs';

export default class BcryptService {
	public static hashPassword(password: string) {
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);

		return hash;
	}

	public static comparePassword(password: string, hash: string) {
		return bcrypt.compareSync(password, hash);
	}
}
