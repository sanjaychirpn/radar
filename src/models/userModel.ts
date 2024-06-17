import { Schema, model, Document } from 'mongoose';
import Checklist from './ChecklistModel';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  FCMToken: string;
  FCMId: string;
  role: Schema.Types.ObjectId;
  examCenter: Schema.Types.ObjectId;
  employeeType: Schema.Types.ObjectId;
  latitude: number;
  longitude: number;
  confirmed: boolean;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  assignChecklists: (examCenterId: Schema.Types.ObjectId) => Promise<void>;
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  FCMToken: { type: String },
  FCMId: { type: String },
  role: { type: Schema.Types.ObjectId, ref: 'UserRole', required: true },
  examCenter: { type: Schema.Types.ObjectId, ref: 'ExamCenter', required: false },
  employeeType: { type: Schema.Types.ObjectId, ref: 'EmployeeType', required: false },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  confirmed: { type: Boolean, default: true },
  blocked: { type: Boolean, default: false }
}, {
  timestamps: true
});

userSchema.methods.assignChecklists = async function (examCenterId) {
  const checklists = await Checklist.find({ examCenter: examCenterId, user: null });
  for (const checklist of checklists) {
    checklist.user = this._id;
    await checklist.save();
  }
};

export default model<IUser>('User', userSchema);
