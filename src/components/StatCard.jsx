import React from 'react';

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-0.5">{title}</p>
      <h3 className="text-2xl font-semibold text-slate-800">{value}</h3>
    </div>
    <div className="text-slate-500">
      {icon}
    </div>
  </div>
);

export default StatCard;