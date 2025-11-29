import React, { useState } from 'react';

const RegistrationView = ({ courses, addEnrollment }) => {
  const [form, setForm] = useState({ studentName: '', gradeLevel: '', parentPhone: '', courseId: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const course = courses.find(c => c.id === parseInt(form.courseId));
    if (!course) return;

    addEnrollment({
      studentName: form.studentName,
      gradeLevel: form.gradeLevel,
      parentPhone: form.parentPhone,
      courseName: course.name,
      price: course.price
    });
    setForm({ studentName: '', gradeLevel: '', parentPhone: '', courseId: '' });
    alert("Student Registered Successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Register Student</h1>
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Student Name</label>
              <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                value={form.studentName} onChange={e => setForm({...form, studentName: e.target.value})} placeholder="e.g. Alex Johnson" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Parent Phone</label>
              <input type="tel" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                value={form.parentPhone} onChange={e => setForm({...form, parentPhone: e.target.value})} placeholder="Optional" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Grade Level / Age</label>
            <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
              value={form.gradeLevel} onChange={e => setForm({...form, gradeLevel: e.target.value})} placeholder="e.g. Grade 5, 10 years old" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Course</label>
            <select required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})}>
              <option value="">-- Choose a Course --</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name} - EGP {c.price.toLocaleString()}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition-all transform hover:scale-[1.02]">
            Confirm Enrollment
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationView;