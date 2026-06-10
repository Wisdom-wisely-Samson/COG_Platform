import ActivityLog from "../models/ActivityLog.js";
import Task from "../models/Task.js";
export const createActivity =
async (req, res) => {

  try {

    const {
      task,
      activityType,
      title,
      description,
      hoursSpent,
      attachments,
    } = req.body;

    const taskRecord =
      await Task.findById(task);

    if (!taskRecord) {

      return res.status(404).json({
        success: false,
        message: "Task not found",
      });

    }

    const activity =
      await ActivityLog.create({

        task,

        user: req.user.id,

        department:
          taskRecord.department,

        activityType,

        title,

        description,

        hoursSpent,

        attachments:
          attachments || [],
      });

    taskRecord.activityCount =
      (taskRecord.activityCount || 0) + 1;

    await taskRecord.save();

    res.status(201).json({
      success: true,
      data: activity,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
export const getTaskActivities =
async (req, res) => {

  try {

    const activities =
      await ActivityLog.find({
        task: req.params.taskId,
      })
        .populate(
          "user",
          "fullName"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
export const getUserActivities =
async (req, res) => {

  try {

    const activities =
      await ActivityLog.find({
        user: req.params.userId,
      })
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
export const getDepartmentActivities =
async (req, res) => {

  try {

    const activities =
      await ActivityLog.find({
        department:
          req.params.departmentId,
      })
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};