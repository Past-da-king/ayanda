import mongoose, { Document, Model, Schema } from 'mongoose';
import { Project as ProjectType } from '@/types'; // Assuming Project type is defined in types
import { v4 as uuidv4 } from 'uuid';

export interface IProject extends Omit<ProjectType, 'id' | 'createdAt' | 'updatedAt'>, Document {
  id: string; // Explicitly string UUID for our 'id' field
  createdAt?: Date;
  updatedAt?: Date;
}

const ProjectSchema: Schema<IProject> = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4(),
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: false }, // Ensure _id is not transformed to id by default for this model when using toObject
    toJSON: { virtuals: false },   // Same for toJSON if needed
  }
);

// Ensure unique combination of userId and name for projects
ProjectSchema.index({ userId: 1, name: 1 }, { unique: true });

const ProjectModel: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default ProjectModel;
