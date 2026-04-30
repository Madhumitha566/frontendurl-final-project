 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard } from 'lucide-react';
import HistoryCard from '../residents/HistoryCard'; 

const UserPaymentHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMyHistory = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');

        const res = await axios.get(`https://final-hostel-project-backend.onrender.com/api/billing/my-history`, {
          headers: {
                 Authorization: `Bearer ${token}` // Added missing curly braces around the header object
          }
           });
        // Combine the objects from the backend into one array
        const combined = [
          ...(res.data.paid || []),
          ...(res.data.unpaid || []),
          ...(res.data.pending || [])
        ];
        
        // Re-sort by date just in case
        combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setHistory(combined);
      } catch (err) {
        console.error("Error fetching personal history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyHistory();
  }, []);

  return (
    <div className="px-8 py-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl font-black text-indigo-900">My Payments</h1>
            <p className="text-gray-500">View and track your billing history</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <CreditCard size={20} />
             </div>
             <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Total Records</p>
                <p className="text-sm font-bold text-gray-700">{history.length}</p>
             </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-400 font-medium font-mono">FETCHING_RECORDS...</p>
          </div>
        ) : (
          <HistoryCard history={history} />
        )}
        
      </div>
    </div>
  );
};

export default UserPaymentHistory;