import React, { useEffect, useState } from 'react';
import { DollarSign, GraduationCap, CheckCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import ActiveClassesView from './ActiveClassesView'; // Import ActiveClassesView
import { ROLES } from '../constants';
import { seedDatabase } from '../seed';
import { db } from '../firebase'; // Import db from firebase
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions
import { calculateDailyRevenue, getCompletedSessionsToday } from '../utils'; // Import utility functions

const DashboardView = ({ user }) => {
  const [activeStudents, setActiveStudents] = useState([]);
  const [todaysRevenue, setTodaysRevenue] = useState(0);
  const [allCompletedSessions, setAllCompletedSessions] = useState([]);

  useEffect(() => {
    if (!user) return; // Exit early if user is null

    // Fetch active enrollments
    const activeEnrollmentsQuery = query(collection(db, 'enrollments'), where('status', '==', 'active'));
    const unsubscribeActive = onSnapshot(activeEnrollmentsQuery, (snapshot) => {
      const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActiveStudents(students);
    });

    // Fetch all completed sessions
    const completedSessionsQuery = query(collection(db, 'enrollments'), where('status', '==', 'completed'));
    const unsubscribeCompleted = onSnapshot(completedSessionsQuery, (snapshot) => {
      const completed = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllCompletedSessions(completed);
      
      // Calculate daily revenue using the utility function
      setTodaysRevenue(calculateDailyRevenue(completed));
    });

    return () => {
      unsubscribeActive();
      unsubscribeCompleted();
    };
  }, [user]);

  // Function to mark a session as completed
  const completeSession = async (sessionId) => {
    try {
      const sessionRef = doc(db, 'enrollments', sessionId);
      await updateDoc(sessionRef, {
        status: 'completed',
        completionTimestamp: serverTimestamp()
      });
      console.log(`Session ${sessionId} marked as completed.`);
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  const completedSessionsToday = getCompletedSessionsToday(allCompletedSessions);

  // Render a loading state or return null if user is not available yet
  if (!user) {
    return (
      <div className="text-center py-10 text-slate-500">Loading dashboard...</div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Welcome back, {user?.role}. Here is today's overview.</p>
      </header>

      {user?.role === ROLES.OWNER && (
        <div className="bg-status-pending/10 border-l-4 border-status-pending text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">Dev Tool</p>
          <p>This button will populate your Firestore database with sample data. Use it once.</p>
          <button
            onClick={seedDatabase}
            className="mt-2 px-4 py-2 bg-status-pending text-white font-bold rounded hover:bg-status-pending-dark"
          >
            Seed Database
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(user?.role === ROLES.OWNER || user?.role === ROLES.ADMIN) && (
          <StatCard 
            title="Total Revenue (Today)" 
            value={`EGP ${todaysRevenue.toLocaleString()}`} 
            icon={<DollarSign className="text-slate-500" size={22} />}
          />
        )}
        <StatCard 
          title="Students in Class" 
          value={activeStudents.length} 
          icon={<GraduationCap className="text-slate-500" size={22} />}
        />
        <StatCard 
          title="Sessions Completed" 
          value={completedSessionsToday.length} 
          icon={<CheckCircle className="text-slate-500" size={22} />}
        />
      </div>

      {/* Render ActiveClassesView */}
      <ActiveClassesView activeStudents={activeStudents} completeSession={completeSession} user={user} />
    </div>
  );
};

export default DashboardView;