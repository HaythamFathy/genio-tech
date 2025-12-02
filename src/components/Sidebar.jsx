import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Users, History, BookOpen, LogOut, X, Database } from 'lucide-react'; // Import Database icon
import { seedDatabase } from '../seed'; // Import seedDatabase function

const Sidebar = ({ user, isSidebarOpen, setSidebarOpen, handleLogout, permissions }) => {
  
  const NavItem = ({ to, icon, label, count }) => (
    <NavLink
      to={to}
      end
      onClick={() => {
        if (window.innerWidth < 768) setSidebarOpen(false);
      }}
      className={({ isActive }) =>
        `w-full flex items-center justify-between p-2 rounded-md transition-all ${
          isActive 
            ? 'border-l-2 border-primary text-primary bg-primary/10' 
            : 'text-slate-600 hover:bg-gray-50'
        }`
      }
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span className="bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full">{count}</span>
      )}
    </NavLink>
  );

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-56 bg-white text-slate-800 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 border-r border-gray-100 flex flex-col`}>
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Genio Tech</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{user?.role}</p>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-500 hover:text-slate-700">
          <X size={24} />
        </button>
      </div>
      
      <nav className="p-3 space-y-2 flex-1">
        {permissions.includes('dashboard') && <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />}
        {permissions.includes('enroll') && <NavItem to="/enroll" icon={<UserPlus size={20} />} label="Register Student" />}
        {permissions.includes('active') && <NavItem to="/active" icon={<Users size={20} />} label="Active Classes" />}
        {permissions.includes('history') && <NavItem to="/history" icon={<History size={20} />} label="History" />}
        {permissions.includes('courses') && <NavItem to="/courses" icon={<BookOpen size={20} />} label="Courses & Fees" />}
        {user?.role === 'Owner' && <NavItem to="/team" icon={<Users size={20} />} label="Team" />}
      </nav>

      <div className="p-3 border-t border-gray-100">
        {process.env.NODE_ENV === 'development' && (
          <button 
            onClick={seedDatabase}
            className="w-full flex items-center gap-3 p-2 rounded-md text-emerald-600 hover:text-emerald-700 transition-colors mb-2"
          >
            <Database size={18} />
            <span className="font-medium">Seed Database</span>
          </button>
        )}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-2 rounded-md text-slate-600 hover:text-status-overdue transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;