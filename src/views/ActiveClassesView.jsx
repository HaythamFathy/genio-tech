import React from 'react';
import { Clock, GraduationCap, CheckCircle } from 'lucide-react';
import { ROLES } from '../constants';

const ActiveClassesView = ({ activeStudents, completeSession, user }) => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        Active Classes <span className="text-lg bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">{activeStudents.length}</span>
      </h1>
      
      {activeStudents.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <GraduationCap size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg">No classes currently in session.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeStudents.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-purple-500 relative group">
              <div className="absolute top-4 right-4">
                 <Clock size={18} className="text-slate-300 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">{item.studentName}</h3>
              <p className="text-slate-500 text-sm mb-4">{item.gradeLevel}</p>
              
              <div className="bg-slate-50 p-3 rounded-lg mb-4">
                <div className="text-xs text-slate-400 uppercase font-semibold">Course</div>
                <div className="font-medium text-slate-700">{item.courseName}</div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                 {(user.role === ROLES.OWNER || user.role === ROLES.ADMIN || user.role === ROLES.CUSTOMER_SERVICE) ? (
                    <span className="font-bold text-slate-800 text-lg">EGP {item.price.toLocaleString()}</span>
                 ) : (
                    <span className="text-slate-400 text-sm">In Progress</span>
                 )}
                 
                 <button onClick={() => completeSession(item.id)} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md shadow-green-100">
                   <CheckCircle size={16} /> Complete
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveClassesView;