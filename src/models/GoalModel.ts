// FULL, COMPLETE, READY-TO-RUN CODE ONLY.
// NO SNIPPETS. NO PLACEHOLDERS. NO INCOMPLETE SECTIONS.
// CODE MUST BE ABLE TO RUN IMMEDIATELY WITHOUT MODIFICATION.
import mongoose, { Document, Model, Schema } from 'mongoose';
import { Goal as GoalType } from '@/types';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

// IGoal represents the Mongoose document.
// It will have Mongoose's default _id: ObjectId.
// We are also explicitly defining a string 'id' field (UUID).
export interface IGoal extends Omit<GoalType, 'id' | 'createdAt' | 'updatedAt' | 'currentValue'>, Document {
  id: string; // This 'id' is our explicitly defined UUID string.
  createdAt?: Date;
  updatedAt?: Date;
}

const GoalSchema: Schema<IGoal> = new Schema(
  {
    // Explicitly define the 'id' field to match the unique index `id_1` in MongoDB.
    id: {
      type: String,
      required: true,
      unique: true, // Ensures this 'id' field is unique in the collection.
      default: () => uuidv4(), // Mongoose will call this function to generate a UUID for 'id'.
    },
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    // currentValue is not stored in DB, it's calculated on fetch
    targetValue: { type: Number, required: true },
    unit: { type: String, required: true },
    category: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: false }, // Consistent with ProjectModel, our 'id' is the primary.
    toObject: { virtuals: false }, // Mongoose's virtual 'id' (for _id) won't be in toObject() output.
  }
);

const GoalModel: Model<IGoal> = mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);

export default GoalModel;
