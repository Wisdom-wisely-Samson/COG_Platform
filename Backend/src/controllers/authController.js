import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// Map backend roles to frontend role keys
const ROLE_MAP = {
  SUPER_ADMIN:      'admin',
  DEPARTMENT_HEAD:  'head',
  TEAM_MEMBER:      'staff',
};

// Map department name to frontend route slug
const DEPT_SLUG = {
  'PR & Media':       '/pr',
  'Digital':          '/digital',
  'Creative':         '/creative',
  'Admin / Ops':      '/admin',
};

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function buildUserPayload(user) {
  const name      = user.fullName;
  const initials  = name.trim().split(' ').map(w => w[0]?.toUpperCase() ?? '').slice(0, 2).join('');
  const role      = ROLE_MAP[user.role] ?? 'staff';
  const dept      = user.department ? (DEPT_SLUG[user.department.name] ?? null) : null;

  return {
    id:       user._id,
    name,
    initials,
    role,
    dept,
    email:    user.email,
    active:   user.active,
    color:    '#FF6600', // default — can be stored per-user later
  };
}

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).populate('department');
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  if (!user.active) {
    return res.status(403).json({ message: 'Account is inactive. Contact your administrator.' });
  }

  res.json({
    token: generateToken(user._id),
    user:  buildUserPayload(user),
  });
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ user: buildUserPayload(req.user) });
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  const user = await User.findOne({ email: email.toLowerCase() });

  // Always respond the same way so we don't reveal whether an email exists
  if (!user) {
    return res.json({ message: 'If that email is registered, a reset code has been generated.' });
  }

  // Generate a 6-digit code valid for 15 minutes
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.passwordResetToken   = resetCode;
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  // In production you would email this code. For this internal platform we
  // return it directly so it can be displayed / shared by the administrator.
  res.json({
    message:   'Reset code generated. Share it with the user.',
    resetCode,
  });
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  const { email, resetCode, newPassword } = req.body;
  if (!email || !resetCode || !newPassword) {
    return res.status(400).json({ message: 'Email, reset code, and new password are required.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters.' });
  }

  const user = await User.findOne({
    email:                email.toLowerCase(),
    passwordResetToken:   resetCode,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset code.' });
  }

  user.password             = await bcrypt.hash(newPassword, 12);
  user.passwordResetToken   = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successfully. You can now log in.' });
};

// POST /api/auth/change-password  (requires login)
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters.' });
  }

  const user = await User.findById(req.user._id);
  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) {
    return res.status(400).json({ message: 'Current password is incorrect.' });
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  res.json({ message: 'Password changed successfully.' });
};
