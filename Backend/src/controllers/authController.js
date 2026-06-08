import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const login = async (req,res)=>{

    try{

        const {
            email,
            password
        } = req.body;

        const user =
        await User.findOne({email})
        .populate("department");

        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid credentials"
            });
        }

        const isMatch =
        await user.comparePassword(password);

        if(!isMatch){

            return res.status(401).json({
                success:false,
                message:"Invalid credentials"
            });

        }

        user.lastLogin = new Date();

        await user.save();

        const token =
        generateToken(user);

        res.status(200).json({

            success:true,

            token,

            user:{
                id:user._id,
                fullName:user.fullName,
                email:user.email,
                role:user.role,
                department:user.department
            }

        });

    }
    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};

export const getProfile =
async (req,res)=>{

    try{

        const user =
        await User.findById(
            req.user.id
        )
        .select("-password")
        .populate("department");

        res.status(200).json({
            success:true,
            user
        });

    }
    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};