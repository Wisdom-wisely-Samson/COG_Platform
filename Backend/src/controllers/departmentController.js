import Department from "../models/Department.js";
import User from "../models/User.js";

export const createDepartment = async (req, res) => {
  try {

    const { name, description } = req.body;

    const existingDepartment =
      await Department.findOne({ name });

    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message: "Department already exists"
      });
    }

    const department =
      await Department.create({
        name,
        description
      });

    res.status(201).json({
      success: true,
      data: department
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
export const getDepartments = async (req, res) => {

  try {

    const departments =
      await Department.find({
        active: true
      })
      .populate(
        "head",
        "fullName email role"
      );

    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
export const getDepartment = async (req, res) => {

  try {

    const department =
      await Department.findById(
        req.params.id
      )
      .populate(
        "head",
        "fullName email"
      );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    res.status(200).json({
      success: true,
      data: department
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
export const updateDepartment = async (
  req,
  res
) => {

  try {

    const department =
      await Department.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    if (!department) {

      return res.status(404).json({
        success: false,
        message: "Department not found"
      });

    }

    res.status(200).json({
      success: true,
      data: department
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
export const deleteDepartment = async (
  req,
  res
) => {

  try {

    const department =
      await Department.findById(
        req.params.id
      );

    if (!department) {

      return res.status(404).json({
        success: false,
        message: "Department not found"
      });

    }

    department.active = false;

    await department.save();

    res.status(200).json({
      success: true,
      message: "Department archived"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
export const assignDepartmentHead =
async (req, res) => {

  try {

    const {
      departmentId,
      userId
    } = req.body;

    const department =
      await Department.findById(
        departmentId
      );

    if (!department) {

      return res.status(404).json({
        success: false,
        message: "Department not found"
      });

    }

    const user =
      await User.findById(userId);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    user.role = "DEPARTMENT_HEAD";

    user.department = department._id;

    await user.save();

    department.head = user._id;

    await department.save();

    res.status(200).json({
      success: true,
      message:
        "Department head assigned"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};