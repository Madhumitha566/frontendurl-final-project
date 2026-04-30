import React, { useEffect, useState } from 'react';
import { Bed, Users, Wrench, AlertCircle, Percent } from 'lucide-react';
import Paymenttenant from './Paymenttenant';

const Overview = () => {
    const [stats, setStats] = useState({
        totalRooms: 0,
        occupiedRooms: 0,
        pendingPayments: 0, 
        availableBeds: 0,
        occupancyRate: 0,
    });

    useEffect(() => {
        // Updated API endpoint to a general dashboard stats or staff-specific one
        fetch('https://final-hostel-project-backend.onrender.com/api/dashboard/stats', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error("Error fetching staff stats:", err));
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl text-indigo-900 font-bold">Staff Overview</h1>
                <p className="text-slate-500">Real-time hostel operational status</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                
                {/* Occupancy Rate Card - Vital for Staff */}
                <div className="bg-indigo-600 p-6 rounded-xl text-white shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm opacity-80 uppercase font-bold tracking-wider">Occupancy Rate</p>
                            <h2 className="text-4xl font-black mt-5">{stats.occupancyRate}%</h2>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Percent size={24} />
                        </div>
                    </div>
                </div>

                {/* Total Rooms Card */}
                <div className="bg-blue-500 p-6 rounded-xl text-white shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm opacity-80 uppercase font-bold tracking-wider">Total Rooms</p>
                            <h2 className="text-4xl font-black mt-5">{stats.totalRooms}</h2>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Bed size={24} />
                        </div>
                    </div>
                </div>

                {/* Occupied Rooms Card */}
                <div className="bg-emerald-500 p-6 rounded-xl text-white shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm opacity-80 uppercase font-bold tracking-wider">Occupied</p>
                            <h2 className="text-4xl font-black mt-5">{stats.occupiedRooms}</h2>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Users size={24} />
                        </div>
                    </div>
                </div>

                {/* Pending Maintenance - Actionable for Staff */}
                <div className="bg-rose-500 p-6 rounded-xl text-white shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm opacity-80 uppercase font-bold tracking-wider">Pending Issues</p>
                            <h2 className="text-4xl font-black mt-5">{stats.pendingPayments || 0}</h2>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Wrench size={24} />
                        </div>
                    </div>
                </div>

            </div>

            {/* Quick Actions or Bottom Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <AlertCircle className="mr-2 text-indigo-600" size={20} />
                    Daily Operations Summary
                </h3>
                <div className="text-slate-600 text-sm">
                    All systems are operational. There are currently <span className="font-bold text-indigo-600">{stats.totalRooms - stats.occupiedRooms}</span> rooms available for new check-ins today.
                </div>
            </div>
            <Paymenttenant/>
        </div>
        
    );
};

export default Overview;