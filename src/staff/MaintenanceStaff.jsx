import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wrench, CheckCircle, PlayCircle, MapPin, User, Phone, AlertCircle } from 'lucide-react';

const MaintenanceStaff = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://final-hostel-project-backend.onrender.com/api/maintenance/staff-tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) setTasks(response.data.tasks);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(`https://final-hostel-project-backend.onrender.com/api/maintenance/update-status/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      
      if (res.data.success) {
        if (newStatus === 'Resolved') {
          setTasks(prev => prev.filter(t => t._id !== id)); // Remove if finished
        } else {
          setTasks(prev => prev.map(t => t._id === id ? { ...t, status: newStatus } : t)); // Update locally
        }
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  if (loading) return <div className="p-10 text-center">Loading Tasks...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-black text-indigo-900 uppercase flex items-center gap-3 mb-8">
        <Wrench className="text-indigo-600" /> Service Queue
      </h1>

      <div className="grid gap-6">
        {tasks.length > 0 ? tasks.map(task => (
          <div key={task._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <MapPin size={14}/> Room {task.roomId?.roomNumber}
                </span>
                <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${
                  task.status === 'In Progress' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {task.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-lg">{task.issueType}</h3>
              <p className="text-slate-500 text-sm">{task.description}</p>
              <div className="flex gap-4 pt-2 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1"><User size={14}/> {task.tenantId?.name}</span>
                <span className="flex items-center gap-1"><Phone size={14}/> {task.tenantId?.phone}</span>
              </div>
            </div>

            <div className="flex gap-3">
              {task.status === 'Assigned' && (
                <button 
                  onClick={() => updateStatus(task._id, 'In Progress')}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  <PlayCircle size={16}/> Start Work
                </button>
              )}
              <button 
                onClick={() => updateStatus(task._id, 'Resolved')}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-50"
              >
                <CheckCircle size={16}/> Complete
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold">
            All caught up! No active tasks.
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceStaff;