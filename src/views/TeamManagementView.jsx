import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../constants';
import { User } from 'lucide-react';

const TeamManagementView = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser || currentUser.role !== ROLES.OWNER) {
      setLoading(false);
      return;
    }

    // Fetch users from a 'users' collection.
    // Assuming users are stored with their UID as the document ID and have 'email' and 'role' fields.
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef); // Fetch all users for now

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching users:", err);
      setError("Failed to load user data.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: newRole
      });
      console.log(`User ${userId} role updated to ${newRole}`);
    } catch (err) {
      console.error("Error updating user role:", err);
      setError("Failed to update user role.");
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-slate-500">Loading team management...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!currentUser || currentUser.role !== ROLES.OWNER) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-100">
        <User size={48} className="mx-auto text-slate-300 mb-4" />
        <p className="text-slate-500 text-lg">You do not have permission to view this page.</p>
      </div>
    );
  }

  const availableRoles = [ROLES.OWNER, ROLES.ADMIN, ROLES.INSTRUCTOR, ROLES.CUSTOMER_SERVICE];

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        Team Management <span className="text-lg bg-secondary/10 text-secondary-dark px-3 py-1 rounded-full font-bold">{users.length}</span>
      </h1>

      <div className="bg-white rounded-lg p-4 border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change Role
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(userItem => (
              <tr key={userItem.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                  {userItem.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {userItem.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <select
                    value={userItem.role}
                    onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    disabled={userItem.id === currentUser.uid} // Prevent changing own role
                  >
                    {availableRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamManagementView;