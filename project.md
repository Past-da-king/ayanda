

## src/models/GoalModel.ts
```typescript
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
```

## src/models/EventModel.ts
```typescript
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
```

## src/models/NoteModel.ts
```typescript
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
```
