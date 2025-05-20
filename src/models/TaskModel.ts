import mongoose, { Document, Model, Schema } from 'mongoose';
import { Task as TaskType, RecurrenceRule, SubTask } from '@/types';

export interface ITask extends TaskType, Document {}

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
  id: { type: String, required: true }, // UUID generated on client/server
  text: { type: String, required: true },
  completed: { type: Boolean, required: true, default: false },
}, { _id: false });

const TaskSchema: Schema<ITask> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true }, // Added
    text: { type: String, required: true },
    completed: { type: Boolean, required: true, default: false },
    dueDate: { type: String, required: false }, // YYYY-MM-DD format
    category: { type: String, required: true },
    recurrenceRule: { type: RecurrenceRuleSchema, required: false },
    subTasks: { type: [SubTaskSchema], required: false, default: [] },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const TaskModel: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default TaskModel;



