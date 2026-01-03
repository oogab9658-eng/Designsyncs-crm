import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

const TeamDashboard = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const { data } = await axios.get('/api/team/tasks');
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateStatus = async (taskId, status) => {
    try {
      await axios.patch(`/api/team/tasks/${taskId}`, { status });
      fetchTasks();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Task Board</h1>
      <p className="text-slate-500 mb-8">View all tasks across projects. You can only update tasks assigned to you.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                {task.projectId?.name || 'Unknown Project'}
              </span>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                task.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {task.status}
              </span>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">{task.title}</h3>
            <p className="text-sm text-slate-600 mb-4">Assigned to: {task.assignedTo?.name || 'Unassigned'}</p>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">Update Status</label>
              <div className="flex space-x-2">
                {['Pending', 'In Progress', 'Completed'].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(task._id, s)}
                    className={`flex-1 text-[10px] font-bold py-2 rounded-lg border transition-all ${
                      task.status === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">No tasks available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDashboard;
