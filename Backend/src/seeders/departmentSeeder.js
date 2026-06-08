import Department
from "../models/Department.js";

const departments = [

  {
    name: "PR",
    description:
      "Public Relations Department"
  },

  {
    name: "DIGITAL",
    description:
      "Digital Marketing Department"
  },

  {
    name: "CREATIVE",
    description:
      "Creative Design Department"
  },

  {
    name: "ADMIN",
    description:
      "Operations Department"
  }

];
const seedDepartments =
async () => {

  for (const department of departments) {

    const exists =
      await Department.findOne({
        name: department.name
      });

    if (!exists) {

      await Department.create(
        department
      );

    }

  }

  console.log(
    "Departments Seeded"
  );

};

export default seedDepartments;