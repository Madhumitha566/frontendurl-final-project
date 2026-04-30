import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCheck, User, Loader2 } from 'lucide-react';

const Maintenance = () => {
  const [requests, setRequests] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await axios.get('https://final-hostel-project-backend.onrender.com/api/maintenance/admin-data', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRequests(res.data.requests || []);
      setStaffList(res.data.staff || []);
    } catch (err) {
      console.error("Error loading admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (reqId, staffId) => {
    try {
      await axios.put('https://final-hostel-project-backend.onrender.com/api/maintenance/assign', 
        { requestId: reqId, staffId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      // Once assigned, the backend sets status to 'Assigned'
      // loadData() will refresh the list and move the item to the Active section
      loadData(); 
    } catch (err) {
      alert("Error assigning staff");
    }
  };

  useEffect(() => { loadData(); }, []);

  // Logical split: Only 'Pending' stays in Section 1
  const pendingRequests = requests.filter(r => r.status === 'Pending');
  
  // Section 2 shows everything currently being handled
  const activeRequests = requests.filter(r => r.status === 'Assigned' || r.status === 'In Progress');

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-indigo-600" size={32} />
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      
      {/* SECTION 1: PENDING ASSESSMENTS */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-amber-500 rounded-full"></div>
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">
              Pending <span className="text-amber-500">Assessments</span>
            </h2>
            <span className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">New Requests</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingRequests.map((req) => (
            <div key={req._id} className="bg-white rounded-3xl shadow-sm border-2 border-dashed border-amber-100 overflow-hidden flex flex-col hover:border-amber-300 transition-all duration-300">
              <div className="px-6 py-3 bg-amber-50/50 border-b border-amber-100 flex justify-between items-center">
                <span className="font-black text-amber-700 text-xs uppercase tracking-wider">
                  {/* Corrected casing to roomNumber */}
                  Room {req.roomId?.roomnumber || req.tenantId?.currentRoom?.roomnumber || 'N/A'}
                </span>
                <span className="text-[9px] font-black text-amber-600 bg-white px-2 py-1 rounded border border-amber-200">NEW</span>
              </div>
              <div className="p-6">
                <h3 className="text-slate-800 font-extrabold text-lg mb-2">{req.issueType}</h3>
                <p className="text-gray-500 text-sm italic mb-4 line-clamp-2 text-ellipsis">"{req.description}"</p>
                
                <div className="relative mt-4 group">
                  <select 
                    className="w-full appearance-none bg-amber-50 border-2 border-amber-100 text-slate-700 text-xs font-bold py-3.5 px-4 rounded-2xl outline-none focus:border-amber-400 transition-colors cursor-pointer"
                    value=""
                    onChange={(e) => handleAssign(req._id, e.target.value)}
                  >
                    <option value="" disabled>Assign Professional...</option>
                    {staffList?.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                  <UserCheck size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>
          ))}
          {pendingRequests.length === 0 && (
            <div className="col-span-full py-12 bg-white border-2 border-dashed border-gray-100 rounded-[2rem] text-center text-gray-300 font-bold uppercase text-xs tracking-widest">
              No Pending Assessments
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: ACTIVE WORKFORCE */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">
              Active <span className="text-indigo-600">Workforce</span>
            </h2>
            <span className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">In Progress</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeRequests.map((req) => (
            <div key={req._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 border-t-4 border-t-indigo-600 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-black text-indigo-900 text-xs uppercase tracking-wider">
                    {/* Fixed req?.tenantIdcurrentRoom typo */}
                    Room {req.roomId?.roomnumber || req.tenantId?.currentRoom?.roomnumber || 'N/A'}
                  </span>
                  <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter ${
                    req.status === 'In Progress' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {req.status}
                  </span>
                </div>
                <h3 className="text-slate-800 font-extrabold mb-5">{req.issueType}</h3>
                
                <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase font-bold leading-none mb-1">Staff</p>
                      <p className="text-slate-700 font-bold text-sm">{req.assignedStaff?.name || 'Assigned'}</p>
                    </div>
                  </div>
                  <select 
                    className="text-[10px] font-black text-indigo-600 bg-white border border-indigo-100 px-2 py-1 rounded-md hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer outline-none"
                    value={req.assignedStaff?._id || ""}
                    onChange={(e) => handleAssign(req._id, e.target.value)}
                  >
                    <option value="" disabled>Transfer</option>
                    {staffList?.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
          {activeRequests.length === 0 && (
            <div className="col-span-full py-12 bg-white border-2 border-dashed border-gray-100 rounded-[2rem] text-center text-gray-300 font-bold uppercase text-xs tracking-widest">
              No Active Tasks
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Maintenance;