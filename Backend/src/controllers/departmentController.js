import Department from '../models/Department.js';

// GET /api/departments
export const getDepartments = async (req, res) => {
  const departments = await Department.find().populate('head', 'fullName email');
  res.json(departments);
};

// POST /api/departments
export const createDepartment = async (req, res) => {
  const { name, description, head } = req.body;
  if (!name) return res.status(400).json({ message: 'Department name is required.' });

  const dept = await Department.create({ name, description, head: head || null });
  res.status(201).json(dept);
};
