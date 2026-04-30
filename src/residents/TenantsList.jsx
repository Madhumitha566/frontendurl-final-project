import React from 'react';

const TenantsList = ({ tenant, onDelete, onEdit }) => {
    // Mapping status to specific CSS colors
    const statusColor = {
        Active: "bg-green-100 text-green-600 border-green-200",
        Inactive: "bg-red-100 text-red-600 border-red-200",
        Pending: "bg-yellow-100 text-yellow-600 border-yellow-200",
    };

    return (
        <div className="bg-white p-3 sm:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            
            {/* HEADER: Name, Room, and Status */}
            <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white flex items-center justify-center font-bold text-xs sm:text-lg shadow-inner">
                    {tenant.name?.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                    <h2 className="font-bold text-gray-800 truncate w-32 md:w-full" title={tenant.name}>
                        {tenant.name}
                    </h2>
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">
                        Room: {tenant.currentRoom?.roomnumber || "Unassigned"}
                    </p>
                </div>

                <span
                    className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md border ${
                        statusColor[tenant.status] || "bg-gray-100 text-gray-500 border-gray-200"
                    }`}
                >
                    {tenant.status}
                </span>
            </div>

            {/* DETAILS SECTION */}
            <div className="text-sm text-gray-600 space-y-2 mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-5 text-center">📧</span>
                    <span className="truncate">{tenant.email}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-5 text-center">📞</span>
                    <span>{tenant.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-5 text-center">💰</span>
                    <span className="font-medium text-gray-800">Rent: ₹{tenant.amount}</span>
                </div>
                
                {/* Emergency Contact Fix: Checks if object exists before rendering */}
                <div className="mt-3 pt-2 border-t border-dashed border-gray-100">
                    <p className="text-[10px] font-bold text-red-500 uppercase mb-1">Emergency Contact</p>
                    <p className="text-xs font-medium text-gray-700">
                        {tenant.emergencyContact?.name || "No name"} — {tenant.emergencyContact?.phone || "No phone"}
                    </p>
                </div>
            </div>

            {/* DATE BADGES */}
            <div className="grid grid-cols-2 gap-2 text-center mb-5">
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <p className="text-[9px] text-gray-400 uppercase font-bold">Check-In</p>
                    <p className="text-xs font-bold text-gray-700">
                        {tenant.checkInDate ? new Date(tenant.checkInDate).toLocaleDateString() : 'N/A'}
                    </p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <p className="text-[9px] text-gray-400 uppercase font-bold">Check-Out</p>
                    <p className="text-xs font-bold text-gray-700">
                        {tenant.checkOutDate ? new Date(tenant.checkOutDate).toLocaleDateString() : 'N/A'}
                    </p>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2">
                <button 
                    onClick={() => onEdit(tenant)}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                    <span>✏️</span> Edit
                </button>
                <button 
                    onClick={() => onDelete(tenant._id)}
                    className="px-4 py-2 border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete Tenant"
                >
                    🗑
                </button>
            </div>
        </div>
    );
};

export default TenantsList;