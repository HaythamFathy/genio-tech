import React from 'react';

const UnauthorizedView = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="p-8 space-y-4 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-status-overdue">Access Denied</h2>
        <p className="text-slate-700">You do not have permission to view this page.</p>
        <p className="text-slate-500">Please contact your administrator if you believe this is an error.</p>
      </div>
    </div>
  );
};

export default UnauthorizedView;
