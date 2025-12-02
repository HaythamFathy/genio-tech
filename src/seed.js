import { faker } from '@faker-js/faker';
import { collection, addDoc, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from './firebase'; // Ensure your firebase config is correctly set up in this file
import { ROLES } from './constants'; // Import ROLES

// --- Helper Functions to create fake data ---

/**
 * Creates a single fake course record.
 */
const createFakeCourse = () => {
  return {
    name: faker.commerce.productName() + ' ' + faker.helpers.arrayElement(['Basics', 'Advanced', 'Workshop']),
    price: faker.number.int({ min: 500, max: 3000 }),
    category: faker.helpers.arrayElement(['Engineering', 'Coding', 'Electronics', 'Design', 'Science']),
    level: faker.helpers.arrayElement(['Beginner', 'Intermediate', 'Advanced']),
    duration: faker.number.int({ min: 4, max: 12 }) + ' weeks',
  };
};

/**
 * Creates a single fake student (user) record.
 */
const createFakeStudent = () => {
  return {
    email: faker.internet.email().toLowerCase(),
    role: ROLES.INSTRUCTOR, // Assign a student role, assuming 'Student' is a valid role, or 'Customer Service' or 'Instructor' etc.
    studentName: faker.person.fullName(),
    gradeLevel: faker.helpers.arrayElement(['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6']),
  };
};

/**
 * Creates a single fake student enrollment record, linking to existing students and courses.
 */
const createFakeEnrollment = (students, courses) => {
  const student = faker.helpers.arrayElement(students);
  const course = faker.helpers.arrayElement(courses);
  const status = faker.helpers.arrayElement(['active', 'completed']);
  const enrollmentDate = faker.date.past({ years: 1, refDate: new Date() });
  
  let completionTimestamp = null;
  if (status === 'completed') {
    completionTimestamp = faker.date.between({ from: enrollmentDate, to: new Date() });
  }

  return {
    studentId: student.id, // Link to the student document ID
    studentName: student.studentName,
    studentEmail: student.email,
    gradeLevel: student.gradeLevel,
    courseId: course.id,
    courseName: course.name,
    price: course.price,
    status: status,
    date: enrollmentDate.toISOString(),
    completionTimestamp: completionTimestamp, // Firebase Timestamp will be set on server
  };
};

// --- Main Seeding Function ---

/**
 * Seeds the Firestore database with dummy students, courses, and enrollment records.
 * This is a destructive operation and should only be used for development/testing.
 * It clears existing data and adds new documents each time it's run.
 */
export const seedDatabase = async () => {
  console.log("Starting database seeding...");

  let batch = writeBatch(db);

  // Clear existing collections (optional, but good for consistent seeding)
  const collectionsToClear = ['users', 'courses', 'enrollments'];
  for (const collectionName of collectionsToClear) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    querySnapshot.forEach((docRef) => {
      batch.delete(docRef.ref);
    });
  }
  await batch.commit(); // Commit deletions first to avoid conflicts

  console.log("Cleared existing data from 'users', 'courses', 'enrollments' collections.");

  // Create a new batch for adding documents
  batch = writeBatch(db); 

  const studentsCollectionRef = collection(db, 'users');
  const coursesCollectionRef = collection(db, 'courses');
  const enrollmentsCollectionRef = collection(db, 'enrollments');

  const generatedStudents = [];
  const generatedCourses = [];

  // Generate and add 5 dummy courses
  console.log("Generating 5 courses...");
  for (let i = 0; i < 5; i++) {
    const fakeCourse = createFakeCourse();
    const docRef = doc(coursesCollectionRef); // Create a new doc reference with a generated ID
    batch.set(docRef, fakeCourse);
    generatedCourses.push({ id: docRef.id, ...fakeCourse }); // Store with ID
  }

  // Generate and add 20 dummy students (as users with a specific role)
  console.log("Generating 20 students...");
  for (let i = 0; i < 20; i++) {
    const fakeStudent = createFakeStudent();
    const docRef = doc(studentsCollectionRef); // Create a new doc reference with a generated ID
    batch.set(docRef, fakeStudent);
    generatedStudents.push({ id: docRef.id, ...fakeStudent }); // Store with ID
  }

  // Generate and add 50 dummy enrollment records
  console.log("Generating 50 enrollment records...");
  for (let i = 0; i < 50; i++) {
    const fakeEnrollment = createFakeEnrollment(generatedStudents, generatedCourses);
    batch.set(doc(enrollmentsCollectionRef), fakeEnrollment);
  }

  try {
    await batch.commit();
    console.log('Database seeding completed successfully!');
    alert('Database seeded with 5 courses, 20 students, and 50 enrollment records!');
  } catch (error) {
    console.error("Error seeding database: ", error);
    alert("There was an error while seeding the database. Check the console for details.");
  }
};
