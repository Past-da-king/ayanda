import mongoose, { Document, Model, Schema } from 'mongoose';
import { Note as NoteType } from '@/types';

export interface INote extends Omit<NoteType, 'id' | 'createdAt' | 'updatedAt'>, Document {
  createdAt?: Date;
  updatedAt?: Date;
  // lastEdited from NoteType (string) will be used, no conflict with Mongoose timestamps
}

const NoteSchema: Schema<INote> = new Schema(
  {
    // id: { type: String, required: true, unique: true }, // Removed, Mongoose will use _id
    userId: { type: String, required: true, index: true }, // Added
    title: { type: String, required: false },
    content: { type: String, required: true },
    category: { type: String, required: true },
    lastEdited: { type: String, required: true }, // ISO string
  },
  {
    timestamps: true, // Will add createdAt, updatedAt. lastEdited is specific.
  }
);

const NoteModel: Model<INote> = mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);

export default NoteModel;


