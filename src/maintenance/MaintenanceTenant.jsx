import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wrench, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const MaintenanceTenant = () => {
  const [form, setForm] = useState({ issueType: '', description: '', priority: '' });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('https://final-hostel-project-backend.onrender.com/api/maintenance/my-requests', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.success) setHistory(res.data.requests);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const submitRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('https://final-hostel-project-backend.onrender.com/api/maintenance/add', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert("Request Submitted Successfully!");
      setForm({ issueType: 'Plumbing', description: '', priority: 'Medium' });
      fetchHistory();
    } catch (err) {
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8  min-h-screen ">
      {/* HEADER SECTION */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-indigo-900 tracking-tight uppercase">
          Maintenance <span className="text-indigo-600">Portal</span>
        </h1>
        <p className="text-gray-400 text-sm font-medium">Report issues and track repair status</p>
      </div>

      <div className="max-w-4xl space-y-8">
        
        {/* REQUEST FORM CARD */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Top Part (White) */}
          <div className="px-8 py-5 flex items-center gap-3 text-indigo-900 font-bold">
            <Wrench size={20} className="text-indigo-600" />
            <span className="tracking-tight text-lg">Submit New Request</span>
          </div>

          {/* Bottom Part (Gray Background) */}
          <div className="bg-gray-50/80 px-8 py-8 border-t border-gray-100">
            <form onSubmit={submitRequest} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Issue Type */}
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2 block">Issue Category</label>
                  <select 
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-semibold text-slate-700 shadow-sm"
                    value={form.issueType}
                    onChange={e => setForm({...form, issueType: e.target.value})}
                  >
                    <option>Select Category</option>
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>Furniture</option>
                    <option>Appliance</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2 block">Priority Level</label>
                  <select 
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-semibold text-slate-700 shadow-sm"
                    value={form.priority}
                    onChange={e => setForm({...form, priority: e.target.value})}
                  >
                    <option >Select Level</option>
                    <option value="Low">Low - Minor Issue</option>
                    <option value="Medium">Medium - Standard</option>
                    <option value="High">High - Emergency</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2 block">Detailed Description</label>
                <textarea 
                  rows="3"
                  className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium text-slate-600 shadow-sm"
                  placeholder="Tell us what needs fixing..."
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] disabled:bg-gray-400"
              >
                {loading ? "Submitting..." : "Submit Maintenance Request"}
              </button>
            </form>
          </div>
        </div>

        {/* HISTORY SECTION */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-5 flex items-center gap-3 text-indigo-900 font-bold">
            <Clock size={20} className="text-indigo-600" />
            <span className="tracking-tight text-lg">Request History</span>
          </div>
          
          <div className="bg-gray-50/80 px-8 py-8 border-t border-gray-100 space-y-4">
            {history.length > 0 ? history.map((req) => (
              <div key={req._id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow gap-4">
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-xl ${req.status === 'Resolved' ? 'bg-green-50 text-green-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {req.status === 'Resolved' ? <CheckCircle size={22}/> : <Clock size={22}/>}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-lg leading-tight">{req.issueType}</h4>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                      {new Date(req.createdAt).toLocaleDateString()} • Priority: 
                      <span className={`ml-1 ${req.priority === 'High' ? 'text-red-500' : 'text-gray-500'}`}>{req.priority}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Status</p>
                    <p className={`text-sm font-black uppercase tracking-tight ${req.status === 'Resolved' ? 'text-green-600' : 'text-indigo-600'}`}>
                      {req.status}
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">
                <AlertTriangle className="mx-auto text-gray-300 mb-2" size={30} />
                <p className="text-gray-400 font-medium">No maintenance requests found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceTenant;