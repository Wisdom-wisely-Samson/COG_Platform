import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "./db.js";
import Department from "../models/Department.js";
import User from "../models/User.js";

const DEPARTMENTS = [
  { name: "PR & Media", description: "Public Relations & Media Department" },
  { name: "Digital", description: "Digital & Social Media Department" },
  { name: "Creative", description: "Creative Department" },
  { name: "Admin / Ops", description: "Admin & Operations Department" },
];

const USER_SEED = [
  {
    fullName: "Super Admin",
    email: "admin@capitalonegroup.com",
    password: "Password123!",
    role: "SUPER_ADMIN",
    departmentName: null,
  },
  {
    fullName: "Amina Yusuf",
    email: "pr.head@capitalonegroup.com",
    password: "Password123!",
    role: "DEPARTMENT_HEAD",
    departmentName: "PR & Media",
  },
  {
    fullName: "Chinedu Okonkwo",
    email: "digital.head@capitalonegroup.com",
    password: "Password123!",
    role: "DEPARTMENT_HEAD",
    departmentName: "Digital",
  },
  {
    fullName: "Tomi Adebayo",
    email: "creative.head@capitalonegroup.com",
    password: "Password123!",
    role: "DEPARTMENT_HEAD",
    departmentName: "Creative",
  },
  {
    fullName: "Ifeoma Nwafor",
    email: "ops.head@capitalonegroup.com",
    password: "Password123!",
    role: "DEPARTMENT_HEAD",
    departmentName: "Admin / Ops",
  },
];

async function seed() {
  await connectDB();
  console.log("Seeding database...");

  const deptMap = new Map();
  for (const dept of DEPARTMENTS) {
    const result = await Department.findOneAndUpdate(
      { name: dept.name },
      { $set: dept },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    deptMap.set(dept.name, result);
  }

  console.log("Departments seeded.");

  for (const userSeed of USER_SEED) {
    const passwordHash = await bcrypt.hash(userSeed.password, 12);
    const department = userSeed.departmentName
      ? deptMap.get(userSeed.departmentName)
      : null;

    const existingUser = await User.findOne({ email: userSeed.email.toLowerCase() });
    let user;

    if (existingUser) {
      await User.updateOne(
        { _id: existingUser._id },
        {
          fullName: userSeed.fullName,
          password: passwordHash,
          role: userSeed.role,
          active: true,
          department: department ? department._id : null,
        },
      );
      user = await User.findById(existingUser._id);
    } else {
      user = await User.create({
        fullName: userSeed.fullName,
        email: userSeed.email.toLowerCase(),
        password: passwordHash,
        role: userSeed.role,
        active: true,
        department: department ? department._id : null,
      });
    }

    if (userSeed.role === "DEPARTMENT_HEAD" && department) {
      await Department.updateOne(
        { _id: department._id },
        { head: user._id },
      );
    }
  }

  console.log("Seeded demo users.");
  await mongoose.disconnect();
  console.log("Seeding complete.");
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
