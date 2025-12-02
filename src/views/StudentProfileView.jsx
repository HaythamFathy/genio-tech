import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react'; // Import Clock icon

const StudentProfileView = ({ studentEmail }) => {
  const [student, setStudent] = useState(null);
  const [enrollmentHistory, setEnrollmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!studentEmail) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        // Fetch student's personal details from the most recent enrollment
        const studentQuery = query(
          collection(db, 'enrollments'),
          where('studentEmail', '==', studentEmail),
          orderBy('date', 'desc'), // Assuming 'date' field exists and represents enrollment date
          limit(1)
        );
        const studentSnapshot = await getDocs(studentQuery);
        if (!studentSnapshot.empty) {
          setStudent(studentSnapshot.docs[0].data());
        } else {
          setStudent(null);
        }

        // Fetch all enrollments for the student, ordered by date
        const enrollmentsQuery = query(
          collection(db, 'enrollments'),
          where('studentEmail', '==', studentEmail),
          orderBy('date', 'desc')
        );
        const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
        const history = enrollmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEnrollmentHistory(history);

      } catch (error) {
        console.error('Error fetching student data:', error);
        setStudent(null);
        setEnrollmentHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentEmail]);

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate(-1)} className="text-primary hover:text-primary-dark mb-6 font-semibold">
        &larr; Back
      </button>
      
      {loading ? (
        <p className="text-slate-500">Loading student profile...</p>
      ) : student ? (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-3xl font-bold mb-2 text-slate-800">{student.studentName}</h2>
            <p className="text-slate-500 text-lg">{student.studentEmail}</p>
            {student.gradeLevel && <p className="text-slate-600">Grade Level: {student.gradeLevel}</p>}
          </div>

          <h3 className="text-2xl font-bold text-slate-800 mb-6">Enrollment History</h3>
          
          {enrollmentHistory.length === 0 ? (
            <p className="text-slate-500">No enrollment history found.</p>
          ) : (
            <div className="relative border-l border-gray-200 ml-4 pl-6">
              {enrollmentHistory.map((item, index) => (
                <div key={item.id} className="mb-8 flex items-start">
                  <div className="absolute w-3 h-3 bg-primary rounded-full mt-1.5 -left-1.5 border border-white"></div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                        <Clock size={16} className="text-slate-400" />
                        <time className="text-sm font-semibold text-slate-500">
                            {new Date(item.date).toLocaleDateString()}
                            {item.completionTimestamp && ` - ${new Date(item.completionTimestamp.toDate()).toLocaleDateString()}`}
                        </time>
                    </div>
                    <h4 className="text-lg font-bold text-slate-800">{item.courseName}</h4>
                    <p className="text-sm text-slate-600">{item.description || 'No description provided.'}</p>
                    <span className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full inline-block ${
                      item.status === 'active' 
                        ? 'bg-status-pending/10 text-status-pending-dark' 
                        : item.status === 'completed'
                          ? 'bg-status-completed/10 text-status-completed-dark'
                          : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-slate-500">Student not found.</p>
      )}
    </div>
  );
};

export default StudentProfileView;
