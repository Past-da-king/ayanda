// FULL, COMPLETE, READY-TO-RUN CODE ONLY.
// NO SNIPPETS. NO PLACEHOLDERS. NO INCOMPLETE SECTIONS.
// CODE MUST BE ABLE TO RUN IMMEDIATELY WITHOUT MODIFICATION.
import mongoose, { Document, Model, Schema } from 'mongoose';
import { Note as NoteType } from '@/types';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

export interface INote extends Omit<NoteType, 'id' | 'createdAt' | 'updatedAt'>, Document {
  id: string; // This 'id' is our explicitly defined UUID string.
  createdAt?: Date;
  updatedAt?: Date;
}

const NoteSchema: Schema<INote> = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4(),
    },
    userId: { type: String, required: true, index: true },
    title: { type: String, required: false },
    content: { type: String, required: true },
    category: { type: String, required: true },
    lastEdited: { type: String, required: true }, // ISO string
  },
  {
    timestamps: true,
    toJSON: { virtuals: false }, // Consistent with ProjectModel
    toObject: { virtuals: false },
  }
);

const NoteModel: Model<INote> = mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);

export default NoteModel;
