import React, { useState } from 'react';
import { Trash2, Download } from 'lucide-react'; // Import Download icon
import { Link } from 'react-router-dom';
import { ROLES } from '../constants';
import SearchBar from '../components/SearchBar';
import { exportHistoryToPDF } from '../utils'; // Import the export function

const HistoryView = ({ enrollments, deleteEnrollment, user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filtered = enrollments.filter(e => 
    e.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Student History</h1>
        <div className="flex items-center gap-4"> {/* Added a flex container for the button and search bar */}
          <button 
            onClick={() => exportHistoryToPDF(filtered)} 
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition-colors text-sm"
          >
            <Download size={16} /> Download Report
          </button>
          <div className="w-full md:w-64">
            <SearchBar 
              placeholder="Search..." 
              value={searchTerm}
              onSearch={setSearchTerm}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 text-sm uppercase">
              <tr>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Student</th>
                <th className="p-4 font-semibold">Grade</th>
                <th className="p-4 font-semibold">Course</th>
                <th className="p-4 font-semibold text-right">Fee</th>
                {(user.role === ROLES.OWNER || user.role === ROLES.ADMIN) && (
                  <th className="p-4 font-semibold text-center">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-400">No records found.</td></tr>
              ) : (
                filtered.slice().reverse().map(item => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-4 text-slate-500 text-sm">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-medium text-slate-900">
                      <Link to={`/student/${item.studentEmail}`} className="hover:text-purple-600 transition-colors">
                        {item.studentName}
                      </Link>
                    </td>
                    <td className="p-4 text-slate-600">{item.gradeLevel}</td>
                    <td className="p-4 text-slate-600">{item.courseName}</td>
                    <td className="p-4 text-right font-medium text-slate-800">EGP {item.price.toLocaleString()}</td>
                    {(user.role === ROLES.OWNER || user.role === ROLES.ADMIN) && (
                      <td className="p-4 text-center">
                        <button onClick={() => deleteEnrollment(item.id)} className="text-red-400 hover:text-red-600 p-1">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;