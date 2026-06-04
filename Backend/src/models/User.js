import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
    fullName:{
        type:String,
        required:true
    },

    email:{
        type:String,
        unique:true,
        required:true
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        enum:[
            "SUPER_ADMIN",
            "DEPARTMENT_HEAD",
            "TEAM_MEMBER"
        ],
        default:"TEAM_MEMBER"
    },

    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Department"
    },

    active:{
        type:Boolean,
        default:true
    }
},
{
    timestamps:true
}
);

export default mongoose.model("User", userSchema);