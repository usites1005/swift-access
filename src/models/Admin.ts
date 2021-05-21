import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IAdmin } from '../types/admin';

const AdminSchema: Schema = new Schema(
	{
		fullName: { type: String, trim: true },
		username: { type: String, trim: true },
		email: {
			type: String,
			lowercase: true,
			trim: true,
			unique: true,
			required: true,
		},
		password: { type: String, required: true },
		imageURL: { type: String, default: '' },
		isSuper: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
AdminSchema.pre<IAdmin>('save', async function (next) {
	var admin = this;

	/**
	 * Ensures the password is hashed before save
	 */
	if (!admin.isModified('password')) return next();

	// generate a salt
	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err);

		// hash the password using our new salt
		bcrypt.hash(admin.password, salt, function (err, hash) {
			if (err) return next(err);

			// override the cleartext password with the hashed one
			admin.password = hash;
			next();
		});
	});
});

/**
 * Methods
 */
AdminSchema.methods = {
	toJSON() {
		const { password, _id, __v, ...rest } = this.toObject() as IAdmin;
		return { ...rest, id: _id };
	},
};

export default model<IAdmin>('Admin', AdminSchema);
