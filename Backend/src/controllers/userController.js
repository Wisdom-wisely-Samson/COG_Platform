import User from "../models/User.js";
import Department from "../models/Department.js";

export const createUser = async (req, res) => {

    try {

        const {
            fullName,
            email,
            password,
            role,
            department
        } = req.body;

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        if (department) {

            const departmentExists =
                await Department.findById(
                    department
                );

            if (!departmentExists) {
                return res.status(404).json({
                    success: false,
                    message: "Department not found"
                });
            }
        }

        const user =
            await User.create({
                fullName,
                email,
                password,
                role,
                department
            });

        res.status(201).json({
            success: true,
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
export const getUsers = async (req, res) => {

    try {

        const filter = {};

        if (req.query.department) {
            filter.department =
                req.query.department;
        }

        if (req.query.role) {
            filter.role =
                req.query.role;
        }

        const users =
            await User.find(filter)
            .select("-password")
            .populate(
                "department",
                "name"
            );

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
export const getUser = async (req, res) => {

    try {

        const user =
            await User.findById(
                req.params.id
            )
            .select("-password")
            .populate(
                "department",
                "name"
            );

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
export const updateUser = async (
    req,
    res
) => {

    try {

        const user =
            await User.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            )
            .select("-password");

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
export const deactivateUser =
async (req, res) => {

    try {

        const user =
            await User.findById(
                req.params.id
            );

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        user.active = false;

        await user.save();

        res.status(200).json({
            success: true,
            message:
                "User deactivated"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
export const reactivateUser =
async (req, res) => {

    try {

        const user =
            await User.findById(
                req.params.id
            );

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        user.active = true;

        await user.save();

        res.status(200).json({
            success: true,
            message:
                "User reactivated"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};