import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/user';
// import { enumToArray, LocationEnumType } from '../types/admin';

const UserSchema = new Schema(
	{
		fullName: { type: String, trim: true, required: true },
		username: { type: String, trim: true, required: true, unique: true },
		btcAddr: { type: String, trim: true, required: true },
		ethAddr: { type: String, trim: true },
		tronAddr: { type: String, trim: true },
		email: {
			type: String,
			lowercase: true,
			trim: true,
			unique: true,
			required: true,
		},
		password: { type: String, required: true },
		imageURL: { type: String, default: '' },
		refBy: { type: String },
		isVerified: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
UserSchema.pre<IUser>('save', function (next) {
	var user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();

	// generate a salt
	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err);

		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err);

			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

/**
 * Methods
 */
UserSchema.methods = {
	toJSON() {
		const {
			password,
			_id,
			__v,
			...rest
		} = this.toObject() as IUser;
		return { ...rest, id: _id };
	},
};

export default model<IUser>('User', UserSchema);
