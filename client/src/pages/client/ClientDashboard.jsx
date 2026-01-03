import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Rocket, Clock, CheckCircle, ShieldCheck } from 'lucide-react';

const ClientDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/client/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProgress();
  }, []);

  if (!data) return <div className="p-8">Loading your project...</div>;

  const { project, tasks } = data;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="bg-indigo-700 rounded-3xl p-10 text-white mb-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-indigo-200 font-medium mb-2 uppercase tracking-widest text-sm">Designsyncs Project Hub</p>
          <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-indigo-600 px-3 py-1 rounded-full">
              <ShieldCheck size={16}/>
              <span className="text-sm font-medium">{project.status}</span>
            </div>
            <p className="text-indigo-200 text-sm">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
          </div>
        </div>
        <Rocket className="absolute right-[-20px] bottom-[-20px] text-white/10" size={200} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Clock className="text-indigo-600" />
            Project Milestones
          </h2>
          <div className="space-y-6">
            {tasks.map((task, idx) => (
              <div key={task._id} className="relative pl-8 border-l-2 border-slate-100 last:border-0 pb-6">
                <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full ${
                  task.status === 'Completed' ? 'bg-green-500' : 'bg-slate-200'
                }`} />
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">{task.title}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-fit">
          <h3 className="font-bold text-slate-800 mb-4 text-center">Overall Progress</h3>
          <div className="relative w-32 h-32 mx-auto mb-6">
             <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" 
                        strokeDasharray={364}
                        strokeDashoffset={364 - (364 * project.progress) / 100}
                        className="text-indigo-600 transition-all duration-1000" />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl text-slate-800">
                {project.progress}%
             </div>
          </div>
          <p className="text-slate-500 text-sm text-center">Your project is currently in the <strong>{project.status}</strong> stage.</p>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
