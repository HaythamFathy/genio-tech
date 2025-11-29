import React from 'react';

const StatCard = ({ title, value, icon, color, borderColor }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${borderColor} flex items-center justify-between`}>
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
    </div>
    <div className={`p-4 rounded-full ${color}`}>
      {icon}
    </div>
  </div>
);

export default StatCard;