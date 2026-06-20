import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
    },
    dueDate: {
      type: Date,
    },
    createdBy: {
      type: String, // Storing user email for frontend compatibility
      required: [true, 'Creator email is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Map _id to id in JSON response
taskSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    if (ret.dueDate && ret.dueDate instanceof Date) {
      ret.dueDate = ret.dueDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }
  },
});

// NOTE: The toJSON transform is utilized to rename '_id' to 'id',
//  remove Mongoose version keys ('__v'), and format 'dueDate' Date objects to 'YYYY-MM-DD' strings.

export const Task = mongoose.model('Task', taskSchema);
export default Task;
