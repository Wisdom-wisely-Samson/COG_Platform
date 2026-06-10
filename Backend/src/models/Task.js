import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
      index: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "IN_PROGRESS",
        "READY_FOR_REVIEW",
        "APPROVED",
        "REJECTED",
        "COMPLETED",
      ],
      default: "PENDING",
      index: true,
    },

    dueDate: {
      type: Date,
      required: true,
      index: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    completedDate: {
      type: Date,
      default: null,
    },

    remarks: {
      type: String,
      default: null,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    approvalComments: {
      type: String,
      default: null,
    },
    createdByDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },

    isOverdue: {
      type: Boolean,
      default: false,
    },

    activityCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Compound indexes
taskSchema.index({
  department: 1,
  status: 1,
});

taskSchema.index({
  assignedTo: 1,
  status: 1,
});

taskSchema.index({
  dueDate: 1,
  status: 1,
});

export default mongoose.model("Task", taskSchema);
