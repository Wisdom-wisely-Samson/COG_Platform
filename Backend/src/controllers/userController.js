import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const ROLE_MAP = {
  SUPER_ADMIN:     'admin',
  DEPARTMENT_HEAD: 'head',
  TEAM_MEMBER:     'staff',
};

const ROLE_REVERSE = {
  admin: 'SUPER_ADMIN',
  head:  'DEPARTMENT_HEAD',
  staff: 'TEAM_MEMBER',
};

const DEPT_SLUG = {
  'PR & Media':  '/pr',
  'Digital':     '/digital',
  'Creative':    '/creative',
  'Admin / Ops': '/admin',
};

function formatUser(u) {
  const name     = u.fullName;
  const initials = name.trim().split(' ').map(w => w[0]?.toUpperCase() ?? '').slice(0, 2).join('');
  return {
    id:       u._id,
    name,
    initials,
    email:    u.email,
    role:     ROLE_MAP[u.role] ?? 'staff',
    dept:     u.department ? (DEPT_SLUG[u.department.name] ?? null) : null,
    active:   u.active,
    color:    '#C41230',
  };
}

// GET /api/users
export const getUsers = async (req, res) => {
  const users = await User.find().populate('department').sort({ createdAt: 1 });
  res.json(users.map(formatUser));
};

// POST /api/users
export const createUser = async (req, res) => {
  const { name, email, password, role, department, active } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' });
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ message: 'Email already in use.' });

  const hashed = await bcrypt.hash(password, 12);
  const user   = await User.create({
    fullName:   name,
    email:      email.toLowerCase(),
    password:   hashed,
    role:       ROLE_REVERSE[role] ?? 'TEAM_MEMBER',
    department: department || null,
    active:     active ?? true,
  });

  const populated = await user.populate('department');
  res.status(201).json(formatUser(populated));
};

// PUT /api/users/:id
export const updateUser = async (req, res) => {
  const { name, email, password, role, department, active } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  if (name)       user.fullName   = name;
  if (email)      user.email      = email.toLowerCase();
  if (role)       user.role       = ROLE_REVERSE[role] ?? user.role;
  if (department !== undefined) user.department = department || null;
  if (active !== undefined)     user.active     = active;
  if (password)   user.password   = await bcrypt.hash(password, 12);

  await user.save();
  const populated = await user.populate('department');
  res.json(formatUser(populated));
};

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json({ message: 'User removed.' });
};

// PATCH /api/users/:id/active
export const toggleActive = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  user.active = !user.active;
  await user.save();
  res.json({ id: user._id, active: user.active });
};
