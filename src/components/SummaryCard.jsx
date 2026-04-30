 import React, { useEffect, useState } from 'react';
import { Bed, Users, IndianRupee, AlertCircle } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
const SummaryCard = () => {
    const [stats, setStats] = useState({
        totalRooms: 0,
        occupiedRooms: 0,
        monthlyRevenue: 0,
        pendingPayments: 0,
        occupancyRate: 0,
        chartData:[]
    });

    useEffect(() => {
        fetch('https://final-hostel-project-backend.onrender.com/api/dashboard/stats', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error("Error fetching stats:", err));
    }, []);
   const formatCurrency = (val) => {
        return (val || 0).toLocaleString('en-IN');
        };
        console.log(formatCurrency(stats.monthlyRevenue))
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl text-indigo-900 font-bold mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Rooms Card */}
                <div className="bg-blue-600 p-6 rounded-xl text-white shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm opacity-80 uppercase font-semibold lg:font-bold tracking-wider">Total Rooms</p>
                            <h2 className="text-4xl font-black mt-5">{stats.totalRooms}</h2>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Bed size={24} />
                        </div>
                    </div>
                   
                </div>

                {/* Occupied Rooms Card */}
                <div className="bg-green-500 p-6 rounded-xl text-white shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm opacity-80 uppercase font-bold tracking-wider">Occupied Rooms</p>
                            <h2 className="text-4xl font-black mt-5">{stats.occupiedRooms}</h2>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Users size={24} />
                        </div>
                    </div>
                    
                </div>

                {/* Revenue Card */}
                <div className="bg-purple-600 p-6 rounded-xl text-white shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm opacity-80 uppercase font-bold tracking-wider">Monthly Revenue</p>
                            <h2 className="text-4xl font-black mt-5">₹{formatCurrency(stats.monthlyRevenue)}</h2>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg">
                            <IndianRupee size={24} />
                        </div>
                    </div>
                </div>

                {/* Pending Payments Card */}
                <div className="bg-orange-500 p-6 rounded-xl text-white shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm opacity-80 uppercase font-bold tracking-wider">Pending Payments</p>
                            <h2 className="text-4xl font-black mt-5">{stats.pendingPayments}</h2>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="w-full text-left mb-8">
                        <h3 className="font-bold text-gray-800 text-lg">Room Occupancy</h3>
                        <p className="text-gray-400 text-xs">Current occupancy distribution</p>
                    </div>

                    <div className="relative w-56 h-56 flex items-center justify-center">
                        <div 
                            className="w-3/4 sm:w-full h-3/4 sm:h-full rounded-full"
                            style={{
                                background: `conic-gradient(#3b82f6 0% ${stats.occupancyRate}%, #f3f4f6 ${stats.occupancyRate}% 100%)`,
                                maskImage: 'radial-gradient(transparent 62%, black 63%)',
                                WebkitMaskImage: 'radial-gradient(transparent 62%, black 63%)'
                            }}
                        ></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                             <span className="font-black text-4xl text-gray-800">{stats.occupancyRate}%</span>
                             <span className="text-xs text-gray-400 uppercase font-bold tracking-widest mt-1">Occupied</span>
                        </div>
                    </div>

                    <div className="flex gap-8 mt-10 w-full justify-center border-t pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-xs text-gray-600 font-semibold uppercase tracking-tight">Occupied ({stats.occupancyRate}%)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                            <span className="text-xs text-gray-600 font-semibold uppercase tracking-tight">Vacant ({100 - stats.occupancyRate}%)</span>
                        </div>
                    </div>
                </div>
                 
                     <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 text-lg mb-1">Financial Trend</h3>
                    <p className="text-gray-400 text-xs mb-6">Last 6 Months</p>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} hide />
                                <Tooltip cursor={{fill: '#f9fafb'}} />
                                <Legend verticalAlign="top" align="right" />
                                <Bar dataKey="revenue" fill="#10b981" name="Revenue" radius={[4, 4, 0, 0]} barSize={25} />
                                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
              
        </div>
    );
};

export default SummaryCard; 