// Default Data
export const INITIAL_COURSES = [
  { id: 1, name: 'Robotics 101 (LEGO)', price: 1200, category: 'Engineering' },
  { id: 2, name: 'Python for Kids', price: 1500, category: 'Coding' },
  { id: 3, name: 'Arduino Electronics', price: 1800, category: 'Electronics' },
  { id: 4, name: '3D Printing & Design', price: 2000, category: 'Design' },
  { id: 5, name: 'Scratch Game Dev', price: 1000, category: 'Coding' },
];

// User Roles
export const ROLES = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  CUSTOMER_SERVICE: 'Customer Service',
  INSTRUCTOR: 'Instructor'
};

// Permission Logic
export const ROLE_PERMISSIONS = {
  [ROLES.OWNER]: ['dashboard', 'enroll', 'active', 'history', 'courses'],
  [ROLES.ADMIN]: ['dashboard', 'enroll', 'active', 'history', 'courses'],
  [ROLES.CUSTOMER_SERVICE]: ['dashboard', 'enroll', 'active', 'history'],
  [ROLES.INSTRUCTOR]: ['dashboard', 'active']
};