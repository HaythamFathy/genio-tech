import React, { useState } from 'react';

const RegistrationView = ({ courses, addEnrollment }) => {
  const [form, setForm] = useState({ 
    studentName: '', 
    age: '', 
    phoneNumber: '', 
    parentName: '', 
    courseId: '',
    paymentStatus: 'Pending' // Default to Pending
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const course = courses.find(c => c.id === parseInt(form.courseId));
    if (!course) return;

    const studentData = {
      name: form.studentName,
      age: parseInt(form.age),
      phoneNumber: form.phoneNumber,
      parentName: form.parentName,
      paymentStatus: form.paymentStatus, // Include payment status
    };

    const enrollmentDetails = {
      courseId: course.id,
      courseName: course.name,
      price: course.price,
      courseLevel: course.level, 
      courseDuration: course.duration, 
    };

    await addEnrollment(studentData, enrollmentDetails);
    setForm({ studentName: '', age: '', phoneNumber: '', parentName: '', courseId: '', paymentStatus: 'Pending' });
    alert("Student Registered Successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Register Student</h1>
      <div className="bg-white rounded-lg border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Student Name</label>
              <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                value={form.studentName} onChange={e => setForm({...form, studentName: e.target.value})} placeholder="e.g. Alex Johnson" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
              <input required type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                value={form.age} onChange={e => setForm({...form, age: e.target.value})} placeholder="e.g. 10" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
              <input type="tel" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                value={form.phoneNumber} onChange={e => setForm({...form, phoneNumber: e.target.value})} placeholder="Optional" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Parent Name</label>
              <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                value={form.parentName} onChange={e => setForm({...form, parentName: e.target.value})} placeholder="Optional" />
            </div>
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Payment Status</label>
            <div className="mt-2 flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-purple-600"
                  name="paymentStatus"
                  value="Paid 50%"
                  checked={form.paymentStatus === 'Paid 50%'}
                  onChange={e => setForm({...form, paymentStatus: e.target.value})}
                />
                <span className="ml-2 text-slate-700">Paid 50%</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-purple-600"
                  name="paymentStatus"
                  value="Paid Full"
                  checked={form.paymentStatus === 'Paid Full'}
                  onChange={e => setForm({...form, paymentStatus: e.target.value})}
                />
                <span className="ml-2 text-slate-700">Paid Full</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-purple-600"
                  name="paymentStatus"
                  value="Pending"
                  checked={form.paymentStatus === 'Pending'}
                  onChange={e => setForm({...form, paymentStatus: e.target.value})}
                />
                <span className="ml-2 text-slate-700">Pending</span>
              </label>
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-md transition-all">
            Confirm Enrollment
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationView;