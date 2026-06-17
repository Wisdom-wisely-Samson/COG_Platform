import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from './db.js';
import User from '../models/User.js';
import Department from '../models/Department.js';

const DEPARTMENTS = [
  { name: 'PR & Media',  description: 'Public Relations & Media Department' },
  { name: 'Digital',     description: 'Digital & Social Media Department'   },
  { name: 'Creative',    description: 'Creative Department'                 },
  { name: 'Admin / Ops', description: 'Admin & Operations Department'       },
];

const HASHED = await bcrypt.hash('admin123', 12);

async function seed() {
  await connectDB();
  console.log('Seeding database...');

  // Clear existing data
  await User.deleteMany();
  await Department.deleteMany();

  // Create departments
  const [pr, digital, creative, admin] = await Department.insertMany(DEPARTMENTS);
  console.log('Departments created.');

  // Create users
  const users = await User.insertMany([
    {
      fullName:   'Super Admin',
      email:      'admin@capitalonegroup.com',
      password:   HASHED,
      role:       'SUPER_ADMIN',
      department: null,
      active:     true,
    },
    {
      fullName:   'Amara Nwosu',
      email:      'amara@capitalonegroup.com',
      password:   HASHED,
      role:       'DEPARTMENT_HEAD',
      department: pr._id,
      active:     true,
    },
    {
      fullName:   'Chisom Eze',
      email:      'chisom@capitalonegroup.com',
      password:   HASHED,
      role:       'TEAM_MEMBER',
      department: pr._id,
      active:     true,
    },
    {
      fullName:   'Kemi Obi',
      email:      'kemi@capitalonegroup.com',
      password:   HASHED,
      role:       'DEPARTMENT_HEAD',
      department: digital._id,
      active:     true,
    },
    {
      fullName:   'Bayo Adeyemi',
      email:      'bayo@capitalonegroup.com',
      password:   HASHED,
      role:       'TEAM_MEMBER',
      department: digital._id,
      active:     true,
    },
    {
      fullName:   'Tunde Makinde',
      email:      'tunde@capitalonegroup.com',
      password:   HASHED,
      role:       'DEPARTMENT_HEAD',
      department: creative._id,
      active:     true,
    },
    {
      fullName:   'Osas Idehen',
      email:      'osas@capitalonegroup.com',
      password:   HASHED,
      role:       'TEAM_MEMBER',
      department: creative._id,
      active:     true,
    },
    {
      fullName:   'Funmi Adeola',
      email:      'funmi@capitalonegroup.com',
      password:   HASHED,
      role:       'DEPARTMENT_HEAD',
      department: admin._id,
      active:     false,
    },
  ]);

  // Assign department heads
  await Department.findByIdAndUpdate(pr._id,      { head: users[1]._id });
  await Department.findByIdAndUpdate(digital._id,  { head: users[3]._id });
  await Department.findByIdAndUpdate(creative._id, { head: users[5]._id });
  await Department.findByIdAndUpdate(admin._id,    { head: users[7]._id });

  console.log(`${users.length} users created.`);
  console.log('\nDemo credentials (all passwords: admin123)');
  console.log('─────────────────────────────────────────');
  users.forEach(u => console.log(`  ${u.role.padEnd(16)} ${u.email}`));

  await mongoose.disconnect();
  console.log('\nSeeding complete.');
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
