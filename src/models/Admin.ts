import { model, Schema, Types } from 'mongoose';
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
		// phone: { type: String },
		imageURL: { type: String, default: '' },
		role: { type: String, enum: ['Store', 'Admin'], default: 'Store' },

		isSuper: { type: Boolean, default: false },
		createdBy: { type: Types.ObjectId, ref: 'Admin' },
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
AdminSchema.pre<IAdmin>('save', function (next) {
	/**
	 * Ensures the password is hashed before save
	 */
	if (!this.isModified('password')) {
		return next();
	}
	bcrypt.hash(this.password, 10, (err, hash) => {
		if (err) {
			return next(err);
		}
		this.password = hash;
		next();
	});
});

AdminSchema.post<IAdmin>('save', function (doc, next) {
	doc
		.populate({ path: 'createdBy', select: '-password' })
		.execPopulate()
		.then(() => {
			next();
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
