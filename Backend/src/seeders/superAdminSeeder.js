import User from "../models/User.js";

const seedSuperAdmin =
async ()=>{

    const exists =
    await User.findOne({
        email:
        "admin@capitalone.com"
    });

    if(exists){
        return;
    }

    await User.create({

        fullName:
        "System Administrator",

        email:
        "admin@capitalone.com",

        password:
        "Admin@123",

        role:
        "SUPER_ADMIN"

    });

    console.log(
        "Super Admin Created"
    );

};

export default seedSuperAdmin;