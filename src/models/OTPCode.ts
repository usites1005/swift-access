import { model, Schema, Types } from 'mongoose';
import { IOTPCode } from '../types/otpCode';

const OTPCodeSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    code: { type: String, unique: true, required: true },
    reference: {
      type: Types.ObjectId,
      refPath: 'referenceModel',
      required: true,
    },
    referenceModel: {
      type: String,
      enum: ['User', 'Admin', 'Order'],
      required: true,
    },
  },
  { timestamps: true },
);

OTPCodeSchema.index({ createdAt: 1 }, { expires: '1d' });

/* always attach populate to save method */
OTPCodeSchema.post<IOTPCode>('save', async function (doc, next) {
  doc
    .populate('user')
    .execPopulate()
    .then(() => {
      next();
    });
});

/* always attach populate to any find method (eg. findOne, find, findOneAndUpdate...) */
OTPCodeSchema.pre<IOTPCode>(/^find/, function () {
  this.populate('user');
});

export default model<IOTPCode>('OTPCode', OTPCodeSchema);
