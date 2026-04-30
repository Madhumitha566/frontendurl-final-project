import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Users, Search, Filter } from 'lucide-react';
import PayHistory from '../staff/PayHistory';

const Paymenttenant = () => {
  const [tenants, setTenants] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [searchTerm, setSearchTerm] = useState("");

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  // 1. Initial Load: Fetch all tenants for the primary dropdown
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await axios.get('https://final-hostel-project-backend.onrender.com/api/tenants/gettenant', getAuthHeader());
        setTenants(res.data);
    
      } catch (err) {
        console.error("Tenant Fetch Error:", err);
      }
    };
    fetchTenants();
  }, []);

  // 2. Data Fetching: Get categorized history from API
  const fetchTenantData = useCallback(async (tenantId) => {
    if (!tenantId) {
      setHistory([]);
      return;
    }
    setLoading(true);
    try {
      const historyRes = await axios.get(`https://final-hostel-project-backend.onrender.com/api/billing/history/${tenantId}`, getAuthHeader());
      
      // Combine paid, unpaid, and pending into one array for the history component
      const combined = [
        ...(historyRes.data.paid || []),
        ...(historyRes.data.unpaid || []),
        ...(historyRes.data.pending || [])
      ];
      setHistory(combined);
    } catch (err) {
      console.error("History Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

 
  const filteredHistory = history.filter(record => {
    const term = searchTerm.toLowerCase();

    const nameMatch = record.tenantId?.name?.toLowerCase().includes(term);

    const monthMatch = record.billingMonth?.toLowerCase().includes(term);
    return nameMatch || monthMatch;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl md:max-w-7xl mx-auto">
        
        {/* Header & Filter Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Primary Tenant Selector */}
            <div className="w-full md:w-1/3">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Select Resident</label>
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100">
                <Users className="text-indigo-500" size={18} />
                <select 
                  className="bg-transparent font-bold text-gray-700 focus:outline-none w-full cursor-pointer text-sm"
                  value={selectedTenant}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedTenant(id);
                    fetchTenantData(id);
                  }}
                >
                  <option value="">Choose a Tenant</option>
                  {tenants.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* History Table Logic */}
        {loading ?(
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-400 font-medium">Fetching records...</p>
          </div>
        ):(
            <PayHistory history={filteredHistory}/>
        )} 
        {!selectedTenant && !loading && (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200 mt-4">
            <p className="text-gray-400 font-medium italic">Please select a resident to view their payment history.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Paymenttenant; 