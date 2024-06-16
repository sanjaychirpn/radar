import { Schema, model, Document } from 'mongoose';

export interface IUserRole extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const userRoleSchema = new Schema({
  name: { type: String, required: true }
}, {
  timestamps: true
});

export default model<IUserRole>('UserRole', userRoleSchema);
