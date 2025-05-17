import mongoose, { Document, Model, Schema } from 'mongoose';
import { Event as EventType } from '@/types'; // Using Event as AppEvent

export interface IEvent extends EventType, Document {}

const EventSchema: Schema<IEvent> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    date: { type: String, required: true }, // ISO string
    duration: { type: Number, required: false },
    description: { type: String, required: false },
    category: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const EventModel: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default EventModel;
