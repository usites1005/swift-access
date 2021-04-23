import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/user';
// import { enumToArray, LocationEnumType } from '../types/admin';

const UserSchema = new Schema(
	{
		fullName: { type: String, trim: true, required: true },
		username: { type: String, trim: true, required: true, unique: true },
		bitcoinA: { type: String, trim: true, required: true },
		sQuestion: { type: String, trim: true, required: true },
		sAnswer: { type: String, trim: true, required: true },
		email: {
			type: String,
			lowercase: true,
			trim: true,
			unique: true,
			required: true,
		},
		password: { type: String, required: true },
		// phone: { type: String, required: true },
		imageURL: { type: String, default: '' },
		// location: {
		// 	type: String,
		// 	enum: enumToArray(LocationEnumType),
		// 	required: true,
		// },
		isVerified: { type: Boolean, default: false },
		deleted: { type: Boolean, default: false },
		deletedAt: { type: Date },
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
	/**
	 * Ensures the password is hashed before save
	 */
	if (!this.isModified('password') && !this.isModified('sAnswer')) {
		return next();
	}

	if (this.isModified('password') && !this.isModified('sAnswer')) {
		bcrypt.hash(this.password, 10, (err, hash) => {
			if (err) {
				return next(err);
			}
			this.password = hash;
			next();
		});
	}

	if (!this.isModified('password') && this.isModified('sAnswer')) {
		bcrypt.hash(this.sAnswer, 10, (err, hash) => {
			if (err) {
				return next(err);
			}
			this.sAnswer = hash;
			next();
		});
	}
});

/**
 * Methods
 */
UserSchema.methods = {
	toJSON() {
		const { sAnswer, password, _id, __v, ...rest } = this.toObject() as IUser;
		return { ...rest, id: _id };
	},
};

export default model<IUser>('User', UserSchema);
