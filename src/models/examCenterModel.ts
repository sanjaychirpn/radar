import { Schema, model, Document } from 'mongoose';
import Checklist from './ChecklistModel';

export interface IExamCenter extends Document {
  name: string;
  centercode: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  dateTime: Date;
}

const examCenterSchema = new Schema({
  name: { type: String, required: true },
  centercode: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  dateTime: { type: Date, required: false }
});

examCenterSchema.post('save', async function (doc) {
  const items = [
    { name: 'Drinking Water', isAvailable: false, images: [] },
    { name: 'Inverter Backup', isAvailable: false, images: [] },
    { name: 'Computer Lab', isAvailable: false, images: [] },
    { name: 'Facilities', isAvailable: false, images: [] },
    { name: 'AC Cooling and Fans', isAvailable: false, images: [] },
    { name: 'Cleanliness', isAvailable: false, images: [] },
    { name: 'Sitting Arrangement', isAvailable: false, images: [] }
  ];

  const oneDayBeforeChecklist = new Checklist({
    type: 'OneDayBefore',
    items: items,
    comments: '',
    examCenter: doc._id,
    user: null // Initially, no user assigned
  });

  const twoHoursBeforeChecklist = new Checklist({
    type: 'TwoHoursBefore',
    items: [
      { name: "PC's Turned on", isAvailable: false, images: [] },
      { name: 'Login Page Opened', isAvailable: false, images: [] },
      { name: 'A4 Sheets Placed', isAvailable: false, images: [] }
    ],
    comments: '',
    examCenter: doc._id,
    user: null // Initially, no user assigned
  });

  await oneDayBeforeChecklist.save();
  await twoHoursBeforeChecklist.save();
});

export default model<IExamCenter>('ExamCenter', examCenterSchema);
