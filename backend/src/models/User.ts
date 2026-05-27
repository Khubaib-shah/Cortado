import mongoose from 'mongoose';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  passwordHash: string;
  createdAt: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  passwordHash: { type: String, required: true },
  createdAt: { type: String, required: true },
});

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.passwordHash;
  },
});

export const User = mongoose.model<IUser>('User', UserSchema);
