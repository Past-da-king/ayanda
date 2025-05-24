// FULL, COMPLETE, READY-TO-RUN CODE ONLY.
// NO SNIPPETS. NO PLACEHOLDERS. NO INCOMPLETE SECTIONS.
// CODE MUST BE ABLE TO RUN IMMEDIATELY WITHOUT MODIFICATION.
import mongoose, { Document, Model, Schema } from 'mongoose';
import { Task as TaskType, RecurrenceRule, SubTask } from '@/types';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

// ITask represents the Mongoose document.
// It will have Mongoose's default _id: ObjectId.
// We are also explicitly defining a string 'id' field (UUID) to align with the unique DB index.
export interface ITask extends Omit<TaskType, 'id' | 'createdAt' | 'updatedAt'>, Document {
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

const SubTaskSchema = new Schema<SubTask>({
  id: { type: String, required: true, default: () => uuidv4() }, // SubTask IDs are also UUIDs
  text: { type: String, required: true },
  completed: { type: Boolean, required: true, default: false },
}, { _id: false }); // No separate _id for embedded sub-documents

const TaskSchema: Schema<ITask> = new Schema(
  {
    // Explicitly define the 'id' field to match the unique index `id_1` in MongoDB.
    id: {
      type: String,
      required: true,
      unique: true, // Ensures this 'id' field is unique in the collection.
      default: () => uuidv4(), // Mongoose will call this function to generate a UUID for 'id'.
    },
    userId: { type: String, required: true, index: true },
    text: { type: String, required: true },
    completed: { type: Boolean, required: true, default: false },
    dueDate: { type: String, required: false },
    category: { type: String, required: true },
    recurrenceRule: { type: RecurrenceRuleSchema, required: false },
    subTasks: { type: [SubTaskSchema], required: false, default: [] },
    linkedGoalId: { type: String, required: false, index: true },
    contributionValue: { type: Number, required: false, default: 1 },
  },
  {
    timestamps: true,
    // The document will have both `_id` (ObjectId, Mongoose default) and our string `id` (UUID).
    // Accessing `doc.id` will refer to our string UUID field.
    // Mongoose's virtual `id` (hex string of `_id`) will still exist but might be less relevant if `id` is primary.
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const TaskModel: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default TaskModel;
