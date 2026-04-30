import React, { useEffect, useState } from 'react';
import { UserPlus, UserMinus } from 'lucide-react';
import AgendaCard from '../staff/AgendaCard'; 

const ListSection = ({ title, list = [], icon: Icon, color, typeLabel }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full">
    <div className="flex items-center gap-3 mb-6">
      <div className={`p-2 rounded-lg ${color === 'green' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
        <Icon size={24} />
      </div>
      <h3 className="font-bold text-lg text-slate-800">{title} ({list.length})</h3>
    </div>
    
    <div className="space-y-4">
      {list.length > 0 ? (
        list.map(item => (
          <AgendaCard 
            key={item._id} 
            item={item} 
            type={typeLabel} 
            color={color} 
          />
        ))
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
          <p className="text-slate-400 italic text-sm">No {title.toLowerCase()} scheduled for today.</p>
        </div>
      )}
    </div>
  </div>
);

const OccupancyStaff = () => {
  const [data, setData] = useState({ checkIns: [], checkOuts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        const res = await fetch('https://final-hostel-project-backend.onrender.com/api/staff/daily-agenda');
        if (!res.ok) throw new Error('Failed to fetch data');
        const json = await res.json();
        setData({
          checkIns: json.checkIns || [],
          checkOuts: json.checkOuts || []
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAgenda();
  }, []);

  if (loading) return (
    <div className="p-20 text-center font-bold text-indigo-900 animate-pulse">
      Loading Agenda...
    </div>
  );

  if (error) return (
    <div className="p-20 text-center text-red-500 font-bold">
      Error: {error}
    </div>
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-indigo-900 tracking-tight">Daily Agenda</h1>
        <p className="text-slate-400 font-semibold">
          {new Date().toLocaleDateString('en-GB', { dateStyle: 'full' })}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <ListSection 
          title="Check-In List" 
          list={data.checkIns} 
          icon={UserPlus} 
          color="green" 
          typeLabel="In" 
        />
        <ListSection 
          title="Check-Out List" 
          list={data.checkOuts} 
          icon={UserMinus} 
          color="red" 
          typeLabel="Out" 
        />
      </div>
    </div>
  );
};

export default OccupancyStaff;