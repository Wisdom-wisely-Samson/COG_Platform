import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";

import connectDB from "./config/db.js";

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{

    console.log(
        `Server running on port ${PORT}`
    );

});
import seedSuperAdmin
from "./seeders/superAdminSeeder.js";

connectDB().then(async ()=>{

    await seedSuperAdmin();

});
import seedDepartments
from "./seeders/departmentSeeder.js";

await seedDepartments();