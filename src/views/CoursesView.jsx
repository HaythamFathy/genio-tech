import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

const CoursesView = ({ courses, addCourse, removeCourse }) => {
  const [newCourse, setNewCourse] = useState({ name: '', price: '', category: 'Coding' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCourse.name || !newCourse.price) return;
    addCourse({ ...newCourse, price: parseFloat(newCourse.price) });
    setNewCourse({ name: '', price: '', category: 'Coding' });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Courses & Fees</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
          <h3 className="text-lg font-bold text-slate-700 mb-4">Add New Course</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Course Name</label>
              <input required type="text" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})} placeholder="e.g. Advanced AI" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Price (EGP)</label>
              <input required type="number" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: e.target.value})} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
              <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  value={newCourse.category} onChange={e => setNewCourse({...newCourse, category: e.target.value})}>
                  <option value="Coding">Coding</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Design">Design</option>
                  <option value="Math">Math</option>
              </select>
            </div>
            <button type="submit" className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-colors">
              Add to Catalog
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">Current Catalog</div>
          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {courses.map(c => (
              <div key={c.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                <div>
                  <div className="font-medium text-slate-900">{c.name}</div>
                  <div className="text-xs text-slate-400">{c.category}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-700">EGP {c.price.toLocaleString()}</span>
                  <button onClick={() => removeCourse(c.id)} className="text-slate-300 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesView;