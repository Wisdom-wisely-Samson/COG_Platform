import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    notes: String,

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    dueDate: Date,

    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },

    status: {
      type: String,
      enum: ['pending', 'in_progress', 'review', 'completed'],
      default: 'pending',
    },

    // Plain-text department name (used when ObjectId ref is not available)
    departmentName: {
      type: String,
      default: '',
    },

    attachments: [
      {
        filename:     String,
        originalName: String,
        mimetype:     String,
        size:         Number,
        url:          String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
