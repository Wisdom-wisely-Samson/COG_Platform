import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
        unique:true
    },

    description:String,

    head:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
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

export default mongoose.model(
    "Department",
    departmentSchema
);