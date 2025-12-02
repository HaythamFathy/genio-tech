import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { db } from './firebase';
import { collection, updateDoc, doc, onSnapshot, addDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import { BrowserRouter, Routes, Route, Outlet, useNavigate, useParams } from 'react-router-dom';

import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import RegistrationView from './views/RegistrationView';
import ActiveClassesView from './views/ActiveClassesView';
import HistoryView from './views/HistoryView';
import CoursesView from './views/CoursesView';
import TeamView from './views/TeamView';
import StudentProfileView from './views/StudentProfileView';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedView from './views/UnauthorizedView';

import { seedDatabase } from './seed';
import { INITIAL_COURSES, ROLE_PERMISSIONS } from './constants';

const Layout = ({ user, isSidebarOpen, setSidebarOpen, handleLogout }) => (
  <div className="flex min-h-screen bg-slate-100 font-sans text-slate-900">
    <Sidebar 
      user={user}
      isSidebarOpen={isSidebarOpen}
      setSidebarOpen={setSidebarOpen}
      handleLogout={handleLogout}
      permissions={ROLE_PERMISSIONS[user?.role] || []}
    />
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm">
         <h2 className="font-bold text-lg text-primary">Genio Tech</h2>
         <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600"><Menu /></button>
      </div>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  </div>
);

const StudentProfileWrapper = () => {
  const { studentEmail } = useParams();
  return <StudentProfileView studentEmail={studentEmail} />;
};


const App = () => {
  const { currentUser, logout } = useAuth();
  const [appUser, setAppUser] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('genio_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  useEffect(() => {
    const fetchAppUser = async () => {
      if (currentUser) {
        const q = query(collection(db, "users"), where("uid", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setAppUser({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() });
        }
      } else {
        setAppUser(null);
      }
    };
    fetchAppUser();
  }, [currentUser]);

  useEffect(() => {
    if (!appUser) return;

    let usersUnsubscribe;
    if (appUser?.role === 'Owner') {
      const usersCollectionRef = collection(db, "users");
      usersUnsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
        const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      });
    } else {
      setUsers([]);
    }

    const enrollmentsCollectionRef = collection(db, "enrollments");
    const enrollmentsUnsubscribe = onSnapshot(enrollmentsCollectionRef, (snapshot) => {
      const enrollmentsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEnrollments(enrollmentsList);
    });

    return () => {
      if (usersUnsubscribe) usersUnsubscribe();
      enrollmentsUnsubscribe();
    };
  }, [appUser]);

  useEffect(() => {
    localStorage.setItem('genio_courses', JSON.stringify(courses));
  }, [courses]);

  const navigate = useNavigate();

  const handleRoleChange = async (uid, newRole) => {
    if (appUser.role !== 'Owner') return;
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, { role: newRole });
  };

  const addEnrollment = async (studentData, enrollmentDetails) => {
    try {
      // 1. Add student to 'students' collection (or update existing student data if needed)
      // For now, we'll create a new student entry for each enrollment if studentData.name is unique
      // In a real app, you might check if the student already exists.
      const studentsCollectionRef = collection(db, "students");
      const newStudentRef = await addDoc(studentsCollectionRef, {
        name: studentData.name,
        age: studentData.age,
        phoneNumber: studentData.phoneNumber,
        parentName: studentData.parentName,
        email: studentData.email || '', // Assuming email might be part of studentData
      });
      const studentId = newStudentRef.id;

      // 2. Add enrollment to 'enrollments' collection
      const newEnrollment = { 
        status: 'active', 
        date: new Date().toISOString(), 
        studentId: studentId, // Link to the student
        ...enrollmentDetails,
        paymentStatus: studentData.paymentStatus || 'Pending', // Add payment status
      };
      const enrollmentsCollectionRef = collection(db, "enrollments");
      await addDoc(enrollmentsCollectionRef, newEnrollment);
      alert("Enrollment Successful!"); // Success notification
      navigate('/active');
    } catch (error) {
      console.error("Error adding enrollment:", error);
      alert("Enrollment Failed. Please try again."); // Failure notification
    }
  };

  const completeSession = async (id) => {
    const enrollmentDocRef = doc(db, "enrollments", id);
    await updateDoc(enrollmentDocRef, {
      status: 'completed',
      completedAt: new Date().toISOString()
    });
  };

  const deleteEnrollment = async (id) => {
    if(window.confirm('Are you sure you want to delete this record?')) {
      const enrollmentDocRef = doc(db, "enrollments", id);
      await deleteDoc(enrollmentDocRef);
    }
  };

  const addCourse = (course) => {
    setCourses([...courses, { id: Date.now(), ...course }]);
  };

  const removeCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
  };
  
  const activeStudents = enrollments.filter(e => e.status === 'active');
  const completedSessions = enrollments.filter(e => e.status === 'completed');
  const today = new Date().toDateString();
  const todaysRevenue = enrollments
    .filter(e => new Date(e.date).toDateString() === today)
    .reduce((sum, e) => sum + Number(e.price), 0);

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout user={appUser} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} handleLogout={logout} />}>
        <Route index element={<DashboardView user={appUser} todaysRevenue={todaysRevenue} activeStudents={activeStudents} completedSessions={completedSessions} today={today} courses={courses} />} />
        <Route path="team" element={<ProtectedRoute allowedRoles={['Owner']} user={appUser}><TeamView users={users} onRoleChange={handleRoleChange} /></ProtectedRoute>} />
        <Route path="enroll" element={<RegistrationView courses={courses} addEnrollment={addEnrollment} />} />
        <Route path="active" element={<ActiveClassesView activeStudents={activeStudents} completeSession={completeSession} user={appUser} />} />
        <Route path="history" element={<HistoryView enrollments={enrollments} deleteEnrollment={deleteEnrollment} user={appUser} />} />
        <Route path="courses" element={<CoursesView courses={courses} addCourse={addCourse} removeCourse={removeCourse} />} />
        <Route path="student/:studentEmail" element={<StudentProfileWrapper />} />
        <Route path="unauthorized" element={<UnauthorizedView />} />
      </Route>
    </Routes>
  );
};

const AppWrapper = () => (
  <BrowserRouter basename="/genio-tech">
    <App />
  </BrowserRouter>
);

export default AppWrapper;