import mongoose from 'mongoose';
import Task         from '../models/Task.js';
import User         from '../models/User.js';
import Notification from '../models/Notification.js';

// ── Helper: create notifications for department head + super admins ────────────
async function notifyReview(task, submitter) {
  try {
    const candidates = await User.find({
      role:   { $in: ['SUPER_ADMIN', 'DEPARTMENT_HEAD'] },
      active: true,
    }).populate('department', 'name');

    const recipients = candidates.filter(u =>
      u.role === 'SUPER_ADMIN' ||
      u.department?.name === task.departmentName
    );

    if (!recipients.length) return;

    const submitterName = submitter?.fullName ?? 'A team member';
    await Notification.insertMany(
      recipients.map(u => ({
        recipient: u._id,
        type:      'task_review',
        message:   `${submitterName} submitted "${task.title}" for review in ${task.departmentName || 'their department'}.`,
        task:      task._id,
      }))
    );
  } catch (err) {
    // Non-critical — log and continue
    console.error('notifyReview error:', err.message);
  }
}

// POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const { title, departmentName, departmentId, assignedTo, dueDate, priority, notes, status } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: 'Task title is required.' });
    }

    const attachments = (req.files ?? []).map(f => ({
      filename:     f.filename,
      originalName: f.originalname,
      mimetype:     f.mimetype,
      size:         f.size,
      url:          `/uploads/${f.filename}`,
    }));

    const deptId     = mongoose.Types.ObjectId.isValid(departmentId) ? departmentId : null;
    const assigneeId = mongoose.Types.ObjectId.isValid(assignedTo)   ? assignedTo   : null;

    const taskStatus = ['pending', 'in_progress', 'review', 'completed'].includes(status)
      ? status
      : 'pending';

    const task = await Task.create({
      title:          title.trim(),
      departmentName: departmentName || '',
      notes:          notes || '',
      department:     deptId,
      assignedTo:     assigneeId,
      createdBy:      req.user._id,
      dueDate:        dueDate || null,
      priority:       priority || 'Medium',
      status:         taskStatus,
      attachments,
    });

    // Fire notifications if submitted straight to review
    if (taskStatus === 'review') {
      await notifyReview(task, req.user);
    }

    res.status(201).json(task);
  } catch (err) {
    console.error('createTask error:', err);
    res.status(500).json({ message: err.message || 'Failed to create task.' });
  }
};

// GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('department', 'name')
      .populate('assignedTo', 'fullName email')
      .populate('createdBy',  'fullName')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('getTasks error:', err);
    res.status(500).json({ message: err.message || 'Failed to fetch tasks.' });
  }
};

// PATCH /api/tasks/:id/status
export const updateTaskStatus = async (req, res) => {
  try {
    const ALLOWED = ['pending', 'in_progress', 'review', 'completed'];
    const { status } = req.body;

    if (!ALLOWED.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed: ${ALLOWED.join(', ')}` });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    // Fire notifications when a task is moved to review
    if (status === 'review') {
      await notifyReview(task, req.user);
    }

    res.json(task);
  } catch (err) {
    console.error('updateTaskStatus error:', err);
    res.status(500).json({ message: err.message || 'Failed to update task status.' });
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task deleted.' });
  } catch (err) {
    console.error('deleteTask error:', err);
    res.status(500).json({ message: err.message || 'Failed to delete task.' });
  }
};
