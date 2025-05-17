import mongoose, { Document, Model, Schema } from 'mongoose';
import { Task as TaskType } from '@/types'; // Using the existing Task type

export interface ITask extends TaskType, Document {}

const TaskSchema: Schema<ITask> = new Schema(
  {
    id: { type: String, required: true, unique: true }, // Retaining UUID from frontend
    text: { type: String, required: true },
    completed: { type: Boolean, required: true, default: false },
    dueDate: { type: String, required: false }, // YYYY-MM-DD format
    category: { type: String, required: true }, // ProjectId
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Prevent model overwrite in HMR
const TaskModel: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default TaskModel;
