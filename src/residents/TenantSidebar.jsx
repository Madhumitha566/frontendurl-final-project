import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Wrench, 
  CreditCard, 
  History, 
  LogOut 
} from 'lucide-react';

const ResidentSidebar = () => {
  // Logic to handle active/inactive styles (matches AdminSidebar)
  const linkClass = ({ isActive }) =>
    `flex items-center space-x-4 py-3 px-4 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-indigo-600 text-white shadow-md font-bold' 
        : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-900'
    }`;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="bg-white h-screen fixed left-0 top-0 bottom-0 w-30 sm:w-45 md:w-64 shadow-xl flex flex-col border-r border-indigo-500 z-50">
      
      {/* Header / Logo Area */}
      <div className="h-20 flex items-center justify-center border-b border-slate-100 px-6">
        <h3 className="text-indigo-900 text-lg font-extrabold tracking-wider uppercase text-center">
          Resident <span className="text-indigo-600">Hub</span>
        </h3>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 pt-6 space-y-2 overflow-y-auto">

        <NavLink to="/resident-dashboard" className={linkClass} end>
          <User size={22} />
          <span className="text-sm tracking-wide hidden sm:block">My Profile</span>
        </NavLink>

        <NavLink to="/resident-dashboard/maintenance" className={linkClass}>
          <Wrench size={22} />
          <span className="text-sm tracking-wide hidden sm:block">Maintenance</span>
        </NavLink>

        <NavLink to="/resident-dashboard/Payments" className={linkClass}>
          <CreditCard size={22} />
          <span className="text-sm tracking-wide hidden sm:block">Make Payment</span>
        </NavLink>

        <NavLink to="/resident-dashboard/history" className={linkClass}>
          <History size={22} />
          <span className="text-sm tracking-wide hidden sm:block">Payment History</span>
        </NavLink>
      </nav>

      {/* Logout Area */}
      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-4 py-3 px-4 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-200 w-full font-semibold"
        >
          <LogOut size={22} />
          <span className="text-sm tracking-wide">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ResidentSidebar;