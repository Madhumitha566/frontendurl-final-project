import React from 'react';
import { useAuth } from '../context/authContext'; 
import { 
  User, Phone, CreditCard, Mail, MapPin, 
  Calendar, AlertCircle, CheckCircle2, Clock,Banknote
} from 'lucide-react';

const TenantProfile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-red-500 font-semibold">
        Access Denied. Please log in.
      </div>
    );
  }

  // Helper for Status Badge colors
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8  min-h-screen ">
      {/* --- HEADER SECTION --- */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <User size={48} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500 flex items-center justify-center md:justify-start gap-1">
            <Mail size={14} /> {user.email}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(user.status)}`}>
              {user.status || 'Active'}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold border border-gray-200">
              Tenant ID: {user._id?.slice(-6).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- LEFT COLUMN: PERSONAL & EMERGENCY --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <User size={18} className="text-blue-500" /> Personal Information
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
              <DetailItem icon={<Phone size={16}/>} label="Phone Number" value={user.phone} />
              <DetailItem icon={<CreditCard size={16}/>} label="Room No" value= {user.currentRoom?.roomnumber || "Not Assigned"}/>
              <DetailItem icon={<Banknote size={20}/>} label="Rent" value={user.amount} />
              <DetailItem icon={<Calendar size={16}/>} label="Check-in Date" value={user.checkInDate ? new Date(user.checkInDate).toLocaleDateString() : 'N/A'} />
              <DetailItem icon={<Clock size={16}/>} label="Check-out Date" value={user.checkOutDate ? new Date(user.checkOutDate).toLocaleDateString() : 'Flexible'} />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-red-50/30">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <AlertCircle size={18} className="text-red-500" /> Emergency Contact
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Contact Name</p>
                <p className="text-gray-700 font-medium">{user.emergencyContact?.name || 'Not Provided'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Contact Phone</p>
                <p className="text-gray-700 font-medium">{user.emergencyContact?.phone || 'Not Provided'}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper Component for consistency
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 text-gray-400">{icon}</div>
    <div>
      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-gray-700">{value}</p>
    </div>
  </div>
);

export default TenantProfile;