// FULL, COMPLETE, READY-TO-RUN CODE ONLY.
// NO SNIPPETS. NO PLACEHOLDERS. NO INCOMPLETE SECTIONS.
// CODE MUST BE ABLE TO RUN IMMEDIATELY WITHOUT MODIFICATION.
import mongoose, { Document, Model, Schema } from 'mongoose';
import { Event as EventType, RecurrenceRule } from '@/types';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

export interface IEvent extends Omit<EventType, 'id' | 'createdAt' | 'updatedAt'>, Document {
  id: string; // This 'id' is our explicitly defined UUID string.
  createdAt?: Date;
  updatedAt?: Date;
}

const RecurrenceRuleSchema = new Schema<RecurrenceRule>({
  type: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], required: true },
  interval: { type: Number, required: true, min: 1 },
  daysOfWeek: { type: [Number], required: false },
  dayOfMonth: { type: Number, required: false },
  monthOfYear: { type: Number, required: false },
  endDate: { type: String, required: false },
  count: { type: Number, required: false },
}, { _id: false });

const EventSchema: Schema<IEvent> = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4(),
    },
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    date: { type: String, required: true }, // ISO string
    duration: { type: Number, required: false }, // in minutes
    description: { type: String, required: false },
    category: { type: String, required: true },
    recurrenceRule: { type: RecurrenceRuleSchema, required: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: false }, // Consistent with ProjectModel
    toObject: { virtuals: false },
  }
);

const EventModel: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default EventModel;
