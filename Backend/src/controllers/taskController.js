import Task from "../models/Task.js";
import User from "../models/User.js";
import Department from "../models/Department.js";
export const createTask = async (
  req,
  res
) => {

  try {

    const {
      title,
      description,
      department,
      assignedTo,
      priority,
      dueDate,
    } = req.body;

    const assignee =
      await User.findById(
        assignedTo
      );

    if (!assignee) {

      return res.status(404).json({
        success: false,
        message: "Assigned user not found",
      });

    }

    const task =
      await Task.create({
        title,
        description,
        department,
        assignedBy: req.user.id,
        assignedTo,
        priority,
        dueDate,
      });

    res.status(201).json({
      success: true,
      data: task,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
// Get all Tasks
export const getTasks = async (
  req,
  res
) => {

  try {

    const filter = {};

    if (req.query.status) {
      filter.status =
        req.query.status;
    }

    if (req.query.department) {
      filter.department =
        req.query.department;
    }

    if (
      req.user.role ===
      "TEAM_MEMBER"
    ) {
      filter.assignedTo =
        req.user.id;
    }

    if (
      req.user.role ===
      "DEPARTMENT_HEAD"
    ) {
      filter.department =
        req.user.department;
    }

    const tasks =
      await Task.find(filter)
        .populate(
          "assignedTo",
          "fullName email"
        )
        .populate(
          "assignedBy",
          "fullName"
        )
        .populate(
          "department",
          "name"
        );

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
// Get Single Task
export const getTask = async (
  req,
  res
) => {

  try {

    const task =
      await Task.findById(
        req.params.id
      )
        .populate(
          "assignedTo",
          "fullName email"
        )
        .populate(
          "assignedBy",
          "fullName"
        )
        .populate(
          "department",
          "name"
        );

    if (!task) {

      return res.status(404).json({
        success: false,
        message: "Task not found",
      });

    }

    res.status(200).json({
      success: true,
      data: task,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
// Update Task
export const updateTaskStatus =
async (req, res) => {

  try {

    const {
      status,
      remarks,
    } = req.body;

    const task =
      await Task.findById(
        req.params.id
      );

    if (!task) {

      return res.status(404).json({
        success: false,
        message: "Task not found",
      });

    }

    task.status = status;

    if (remarks) {
      task.remarks = remarks;
    }

    if (
      status === "COMPLETED"
    ) {
      task.completedDate =
        new Date();
    }

    await task.save();

    res.status(200).json({
      success: true,
      data: task,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
// Review Task (Approve/Reject)
export const reviewTask =
async (req, res) => {

  try {

    const {
      action,
      remarks,
    } = req.body;

    const task =
      await Task.findById(
        req.params.id
      );

    if (!task) {

      return res.status(404).json({
        success: false,
        message: "Task not found",
      });

    }

    if (
      action === "APPROVE"
    ) {
      task.status =
        "APPROVED";
    }

    if (
      action === "REJECT"
    ) {
      task.status =
        "REJECTED";
    }

    task.remarks =
      remarks;

    await task.save();

    res.status(200).json({
      success: true,
      data: task,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};