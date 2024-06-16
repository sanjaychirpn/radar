import { Schema, model, Document } from 'mongoose';

export interface IEmployeeType extends Document {
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

const employeeTypeSchema = new Schema({
  type: { type: String, required: true }
}, {
  timestamps: true
});

export default model<IEmployeeType>('EmployeeType', employeeTypeSchema);
