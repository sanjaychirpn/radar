import { Schema, model, Document, Types } from 'mongoose';

interface IChecklistItem {
  name: string;
  isAvailable: boolean;
  image?:string[];
}

export interface IChecklist extends Document {
  type: 'OneDayBefore' | 'TwoHoursBefore';
  items: IChecklistItem[];
  comments?: string;
  examCenter: Types.ObjectId;
  user: Types.ObjectId | null;
}

const checklistSchema = new Schema({
  type: { type: String, enum: ['OneDayBefore', 'TwoHoursBefore'], required: true },
  items: [{
    name: { type: String, required: true },
    isAvailable: { type: Boolean, required: true },
    images: { type: [String], default: [] } 
  }],
  comments: { type: String },
  examCenter: { type: Schema.Types.ObjectId, ref: 'ExamCenter', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

export default model<IChecklist>('Checklist', checklistSchema);
