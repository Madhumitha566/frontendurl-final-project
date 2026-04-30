import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { TrendingUp, Users, Home, DollarSign, AlertCircle } from 'lucide-react';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://final-hostel-project-backend.onrender.com/api/reports/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (err) {
        const message = err.response?.data?.message || err.message;
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 text-xl font-medium">Generating Report...</div>;
  if (error) return (
    <div className="p-8 text-red-500 flex items-center justify-center gap-2">
      <AlertCircle /> Error: {error}
    </div>
  );

  // Synchronized with your Backend Controller keys
  const { summary, trendData } = data || {};

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-indigo-900">Property Performance</h1>
          <p className="text-gray-500">Financial overview for the last 6 months</p>
        </div>
      </div>

      {/* --- KPI SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue" 
          value={`$${summary?.totalRevenue?.toLocaleString() ?? 0}`} 
          icon={<DollarSign className="text-green-600" />}
          subtext="6-Month Period"
        />
        <StatCard 
          title="Occupancy Rate" 
          value={`${summary?.occupancyRate ?? 0}%`} 
          icon={<Home className="text-blue-600" />}
          subtext="Current Snapshot"
        />
        <StatCard 
          title="Active Tenants" 
          value={summary?.activeTenants ?? 0} 
          icon={<Users className="text-purple-600" />}
          subtext="Verified Status"
        />
        <StatCard 
          title="Net Profit" 
          value={`$${summary?.netProfit?.toLocaleString() ?? 0}`} 
          icon={<TrendingUp className={summary?.netProfit >= 0 ? "text-green-600" : "text-red-600"} />}
          subtext="After Expenses"
          trendColor={summary?.netProfit >= 0 ? "text-green-600" : "text-red-600"}
        />
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Revenue vs Expenses</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                />
                <Legend />
                <Bar name="Revenue" dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar name="Expenses" dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Trajectory */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Net Profit Trajectory</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(val) => `$${val}`} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Profit']} />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, subtext, trendColor = "text-gray-900" }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <h4 className={`text-2xl font-bold mt-1 ${trendColor}`}>{value}</h4>
        {subtext && <p className="text-xs text-gray-400 mt-1 font-medium">{subtext}</p>}
      </div>
      <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
    </div>
  </div>
);

export default Reports;