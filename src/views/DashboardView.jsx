import React from 'react';
import { DollarSign, GraduationCap, CheckCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import { ROLES } from '../constants';

const DashboardView = ({ user, todaysRevenue, activeStudents, completedSessions, today }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Welcome back, {user.role}. Here is today's overview.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(user.role === ROLES.OWNER || user.role === ROLES.ADMIN) && (
          <StatCard 
            title="Total Revenue (Today)" 
            value={`EGP ${todaysRevenue.toLocaleString()}`} 
            icon={<DollarSign className="text-green-500" size={32} />}
            color="bg-green-50"
            borderColor="border-green-200"
          />
        )}
        <StatCard 
          title="Students in Class" 
          value={activeStudents.length} 
          icon={<GraduationCap className="text-purple-500" size={32} />}
          color="bg-purple-50"
          borderColor="border-purple-200"
        />
        <StatCard 
          title="Sessions Completed" 
          value={completedSessions.filter(e => new Date(e.date).toDateString() === today).length} 
          icon={<CheckCircle className="text-blue-500" size={32} />}
          color="bg-blue-50"
          borderColor="border-blue-200"
        />
      </div>
    </div>
  );
};

export default DashboardView;