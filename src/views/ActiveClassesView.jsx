import React from 'react';
import { Clock, GraduationCap, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROLES } from '../constants';

const ActiveClassesView = ({ activeStudents, completeSession, user }) => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        Active Classes <span className="text-lg bg-secondary/10 text-secondary-dark px-3 py-1 rounded-full font-bold">{activeStudents.length}</span>
      </h1>
      
      {activeStudents.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-100">
          <GraduationCap size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg">No classes currently in session.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-4 border border-gray-100 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Name
                </th>
                {(user.role === ROLES.OWNER || user.role === ROLES.ADMIN || user.role === ROLES.CUSTOMER_SERVICE) && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeStudents.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/student/${item.studentEmail}`} className="text-left">
                      <h3 className="text-sm font-medium text-slate-800 hover:text-primary transition-colors">{item.studentName}</h3>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {item.gradeLevel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {item.courseName}
                  </td>
                  {(user.role === ROLES.OWNER || user.role === ROLES.ADMIN || user.role === ROLES.CUSTOMER_SERVICE) && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                      EGP {item.price.toLocaleString()}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => completeSession(item.id)} className="inline-flex items-center gap-2 border border-status-completed/20 text-status-completed-dark px-3 py-2 rounded-md font-medium text-xs transition-colors hover:bg-status-completed/10">
                      <CheckCircle size={16} /> Complete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActiveClassesView;