import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface ITask extends Document {
  title: string;
  description?: string;
  completed: boolean;
  user: IUser['_id'];
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>('Task', taskSchema);
