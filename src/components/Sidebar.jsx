import React from 'react';
import { LayoutDashboard, UserPlus, Users, History, BookOpen, LogOut, X } from 'lucide-react';

const Sidebar = ({ user, activeTab, setActiveTab, isSidebarOpen, setSidebarOpen, handleLogout, permissions }) => {
  
  const NavButton = ({ id, icon, label, count }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        if (window.innerWidth < 768) setSidebarOpen(false);
      }}
      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
        activeTab === id 
          ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">{count}</span>
      )}
    </button>
  );

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 shadow-2xl flex flex-col`}>
      <div className="p-6 border-b border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">Genio Tech</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{user.role}</p>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
          <X size={24} />
        </button>
      </div>
      
      <nav className="p-4 space-y-2 flex-1">
        {permissions.includes('dashboard') && <NavButton id="dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />}
        {permissions.includes('enroll') && <NavButton id="enroll" icon={<UserPlus size={20} />} label="Register Student" />}
        {permissions.includes('active') && <NavButton id="active" icon={<Users size={20} />} label="Active Classes" />}
        {permissions.includes('history') && <NavButton id="history" icon={<History size={20} />} label="History" />}
        {permissions.includes('courses') && <NavButton id="courses" icon={<BookOpen size={20} />} label="Courses & Fees" />}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;