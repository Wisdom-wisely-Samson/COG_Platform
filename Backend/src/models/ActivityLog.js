import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    activityType: {
      type: String,
      enum: [
        "DAILY_UPDATE",
        "WEEKLY_UPDATE",
        "MONTHLY_UPDATE",
        "FILE_UPLOAD",
        "COMMENT",
        "STATUS_CHANGE",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    hoursSpent: {
      type: Number,
      default: 0,
      min: 0,
    },

    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({
  task: 1,
  createdAt: -1,
});

activityLogSchema.index({
  user: 1,
  createdAt: -1,
});

activityLogSchema.index({
  department: 1,
  createdAt: -1,
});

export default mongoose.model(
  "ActivityLog",
  activityLogSchema
);