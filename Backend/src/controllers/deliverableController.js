import Deliverable from "../models/Deliverable.js";
import Task from "../models/Task.js";
export const createDeliverable =
async (req, res) => {

  try {

    const {
      task,
      type,
      title,
      description,
      fileName,
      fileUrl,
      fileType,
      externalUrl,
      metadata,
    } = req.body;

    const taskRecord =
      await Task.findById(task);

    if (!taskRecord) {

      return res.status(404).json({
        success: false,
        message: "Task not found",
      });

    }

    const deliverable =
      await Deliverable.create({

        task,

        uploadedBy:
          req.user.id,

        department:
          taskRecord.department,

        type,

        title,

        description,

        fileName,

        fileUrl,

        fileType,

        externalUrl,

        metadata,
      });

    res.status(201).json({
      success: true,
      data: deliverable,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
export const getTaskDeliverables =
async (req, res) => {

  try {

    const deliverables =
      await Deliverable.find({
        task: req.params.taskId,
      })
      .populate(
        "uploadedBy",
        "fullName"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: deliverables.length,
      data: deliverables,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
export const reviewDeliverable =
async (req, res) => {

  try {

    const {
      action,
      comments,
    } = req.body;

    const deliverable =
      await Deliverable.findById(
        req.params.id
      );

    if (!deliverable) {

      return res.status(404).json({
        success: false,
        message: "Deliverable not found",
      });

    }

    deliverable.status =
      action === "APPROVE"
      ? "APPROVED"
      : "REJECTED";

    deliverable.reviewedBy =
      req.user.id;

    deliverable.reviewedAt =
      new Date();

    deliverable.reviewComments =
      comments;

    await deliverable.save();

    res.status(200).json({
      success: true,
      data: deliverable,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};