import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  id: string;
  email: string;
  name?: string;
  passwordHash: string;
  userContextSummary: string; // Added for persistent AI context
  comparePassword(password: string): Promise<boolean>;
  createdAt?: Date; // Added by timestamps
  updatedAt?: Date; // Added by timestamps
}

const UserSchema: Schema<IUser> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    userContextSummary: { type: String, default: '' }, // Added field with default
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password (only if modified or new)
UserSchema.pre<IUser>('save', async function (next) {
  // Only hash the password if it has been modified (or is new) AND it's not already a hash
  // This check is simplified; a more robust check might be needed if password can be set directly as a hash.
  // For our current flow, password is set plain on creation, so this is fine.
  if (!this.isModified('passwordHash')) return next();
  
  // Avoid re-hashing an already hashed password if a direct update with a hash occurs (less likely with current setup)
  // A common way to check if it's already hashed is by length or a prefix, but bcrypt hashes vary.
  // For simplicity, we assume if isModified is true, it's a new plain password.
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    return next();
  } catch (error) {
    return next(error as Error);
  }
});

UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;

