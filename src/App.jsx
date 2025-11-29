import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

import Sidebar from './components/Sidebar';
import LoginPage from './components/LoginPage';
import DashboardView from './views/DashboardView';
import RegistrationView from './views/RegistrationView';
import ActiveClassesView from './views/ActiveClassesView';
import HistoryView from './views/HistoryView';
import CoursesView from './views/CoursesView';

import { INITIAL_COURSES, ROLE_PERMISSIONS } from './constants';

const App = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('genio_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });
  
  const [enrollments, setEnrollments] = useState(() => {
    const saved = localStorage.getItem('genio_enrollments');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('genio_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('genio_enrollments', JSON.stringify(enrollments));
  }, [enrollments]);

  const handleLogin = (role, password) => {
    setUser({ role, name: `${role} User` });
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
  };

  const addEnrollment = (data) => {
    const newEnrollment = {
      id: Date.now(),
      status: 'active',
      date: new Date().toISOString(),
      ...data
    };
    setEnrollments([newEnrollment, ...enrollments]);
    setActiveTab('active');
  };

  const completeSession = (id) => {
    setEnrollments(enrollments.map(e => 
      e.id === id ? { ...e, status: 'completed', completedAt: new Date().toISOString() } : e
    ));
  };

  const deleteEnrollment = (id) => {
    if(window.confirm('Are you sure you want to delete this record?')) {
      setEnrollments(enrollments.filter(e => e.id !== id));
    }
  };

  const addCourse = (course) => {
    setCourses([...courses, { id: Date.now(), ...course }]);
  };

  const removeCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const activeStudents = enrollments.filter(e => e.status === 'active');
  const completedSessions = enrollments.filter(e => e.status === 'completed');
  const today = new Date().toDateString();
  const todaysRevenue = enrollments
    .filter(e => new Date(e.date).toDateString() === today)
    .reduce((sum, e) => sum + Number(e.price), 0);

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-900">
      <Sidebar 
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
        permissions={ROLE_PERMISSIONS[user.role] || []}
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm">
           <h2 className="font-bold text-lg text-purple-600">Genio Tech</h2>
           <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600"><Menu /></button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === 'dashboard' && <DashboardView 
            user={user} 
            todaysRevenue={todaysRevenue} 
            activeStudents={activeStudents} 
            completedSessions={completedSessions}
            today={today}
          />}
          {activeTab === 'enroll' && <RegistrationView 
            courses={courses} 
            addEnrollment={addEnrollment} 
          />}
          {activeTab === 'active' && <ActiveClassesView 
            activeStudents={activeStudents} 
            completeSession={completeSession} 
            user={user}
          />}
          {activeTab === 'history' && <HistoryView 
            enrollments={enrollments} 
            deleteEnrollment={deleteEnrollment} 
            user={user}
          />}
          {activeTab === 'courses' && <CoursesView 
            courses={courses} 
            addCourse={addCourse} 
            removeCourse={removeCourse}
          />}
        </main>
      </div>
    </div>
  );
};

export default App;