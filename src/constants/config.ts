const server = import.meta.env.VITE_SERVER;

const loginAdmin = `${server}/api/auth/admin/login`; //POST
const loginSchoolAdmin = `${server}/api/auth/school-admin/login`; //POST
const createAdmin = `${server}/api/auth/admin/create`; //POST
const createSchoolAdmin = `${server}/api/auth/school-admin/create`; //POST

const getAllTransaction = `${server}/api/transactions`;
const getAllTransactionBySchool = `${server}/api/transactions/school`;

const logout = `${server}/api/auth/logout`;

export {
  loginAdmin,
  loginSchoolAdmin,
  createAdmin,
  createSchoolAdmin,
  getAllTransaction,
  getAllTransactionBySchool,
  logout,
};
