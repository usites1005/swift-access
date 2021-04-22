import { Document } from 'mongoose';
import { TAllUsers } from './expressTypes';

export interface IOTPCode extends Document {
  user: TAllUsers & string;
  code: string;
  reference: string;
  referenceModel: string;
}
