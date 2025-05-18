import mongoose, { Document, Model, Schema } from 'mongoose';
import { Goal as GoalType } from '@/types';

export interface IGoal extends GoalType, Document {}

const GoalSchema: Schema<IGoal> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true }, // Added
    name: { type: String, required: true },
    currentValue: { type: Number, required: true, default: 0 },
    targetValue: { type: Number, required: true },
    unit: { type: String, required: true },
    category: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const GoalModel: Model<IGoal> = mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);

export default GoalModel;

