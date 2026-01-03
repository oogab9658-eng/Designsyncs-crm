import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Plus, UserPlus, Calendar, CheckCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const location = useLocation();
  const [reports, setReports] = useState(null);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', projectName: '', deadline: ''
  });

  const isDashboard = location.pathname === '/admin';
  const isReports = isDashboard || location.pathname === '/admin/reports';
  const isUsers = isDashboard || location.pathname === '/admin/users';

  const fetchReports = async () => {
    const { data } = await axios.get('/api/admin/reports');
    setReports(data);
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/admin/users');
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    if (isReports) fetchReports();
    if (isUsers) fetchUsers();
  }, [isReports, isUsers]);

  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/clients', formData);
      setShowModal(false);
      fetchReports();
      fetchUsers();
      alert('Client onboarded and automated workflow started!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating client');
    }
  };

  if ((isReports && !reports) || (isUsers && users.length === 0 && !reports)) return <div className="p-8">Loading...</div>;

  const getTitle = () => {
    if (location.pathname === '/admin/users') return 'Users Management';
    if (location.pathname === '/admin/reports') return 'Reports Board';
    return 'Admin Dashboard';
  };

  const getSubtitle = () => {
    if (location.pathname === '/admin/users') return 'Manage users and roles';
    if (location.pathname === '/admin/reports') return 'View project and task reports';
    return 'Manage your agency workflow';
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{getTitle()}</h1>
          <p className="text-slate-500">{getSubtitle()}</p>
        </div>
        {isDashboard && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-all"
          >
            <Plus size={20} />
            <span>New Client Onboarding</span>
          </button>
        )}
      {isReports && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Total Projects', value: reports.summary.totalProjects, icon: <Calendar className="text-blue-500" /> },
              { label: 'Completed', value: reports.summary.completedProjects, icon: <CheckCircle className="text-green-500" /> },
              { label: 'Active Tasks', value: reports.summary.totalTasks, icon: <Clock className="text-orange-500" /> },
              { label: 'Completed Tasks', value: reports.summary.completedTasks, icon: <CheckCircle className="text-indigo-500" /> },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
                <div className="p-3 bg-slate-50 rounded-lg">{stat.icon}</div>
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-4">Project Status</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Project Name</th>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.projectStats.map((proj) => (
                  <tr key={proj._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">{proj.name}</td>
                    <td className="px-6 py-4 text-slate-600">{proj.client?.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        proj.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${proj.progress}%` }}></div>
                      </div>
                      <span className="text-xs text-slate-500 mt-1 inline-block">{proj.progress}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {isUsers && (
        <>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Users</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Specialization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-red-100 text-red-700' :
                        user.role === 'team' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{user.specialization || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8">
            <h2 className="text-xl font-bold mb-6">Automated Client Onboarding</h2>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Client Name</label>
                  <input required className="w-full border rounded-lg p-2" onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input required type="email" className="w-full border rounded-lg p-2" onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password (Temporary)</label>
                <input required type="password" placeholder="Min 6 chars" className="w-full border rounded-lg p-2" onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <input required className="w-full border rounded-lg p-2" onChange={e => setFormData({...formData, projectName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deadline</label>
                <input required type="date" className="w-full border rounded-lg p-2" onChange={e => setFormData({...formData, deadline: e.target.value})} />
              </div>
              <div className="flex space-x-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border py-2 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg">Create Workflow</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
