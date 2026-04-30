import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  BedDouble, 
  UserPlus, 
  Wrench, 
  ClipboardCheck, 
  BellRing 
} from 'lucide-react';



const StaffSidebar=()=>{
   
    const linkClass = ({ isActive }) =>
        `flex items-center space-x-4 py-3 px-4 rounded-xl transition-all duration-200 ${
            isActive 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 font-bold' // High contrast active
            : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-900' // Subtle hover
        }`;

    return (
        <div className="bg-white h-screen fixed left-0 top-0 bottom-0 w-30 sm:w-45 md:w-64 shadow-xl flex flex-col border-r border-indigo-100">
            
            <div className="h-20 flex items-center justify-center border-b border-slate-50 px-6">
                <h3 className="text-indigo-900 text-lg font-black tracking-widest uppercase text-center">
                    Staff <span className="text-indigo-600">Portal</span>
                </h3>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 pt-8 space-y-2 overflow-y-auto">
                <NavLink to="/staff-dashboard" className={linkClass} end>
                    <LayoutDashboard size={20} />
                    <span className="text-sm font-bold tracking-tight hidden sm:block">Overview</span>
                </NavLink>

                {/* Check-In/Out is a core Staff responsibility */}
                <NavLink to="/staff-dashboard/occupancy" className={linkClass}>
                    <ClipboardCheck size={20} />
                    <span className="text-sm font-bold tracking-tight hidden sm:block">Check-In / Out</span>
                </NavLink>

                <NavLink to="/staff-dashboard/rooms" className={linkClass}>
                    <BedDouble size={20} />
                    <span className="text-sm font-bold tracking-tight hidden sm:block">Room Status</span>
                </NavLink>

                <NavLink to="/staff-dashboard/tenants" className={linkClass}>
                    <UserPlus size={20} />
                    <span className="text-sm font-bold tracking-tight hidden sm:block">Resident List</span>
                </NavLink>

                <NavLink to="/staff-dashboard/maintenance" className={linkClass}>
                    <Wrench size={20} />
                    <span className="text-sm font-bold tracking-tight hidden sm:block">Repair Tasks</span>
                </NavLink>

            </nav>

            {/* Bottom Section: User Role Badge */}
            <div className="p-6 border-t border-slate-50">
                <div className="bg-indigo-50 rounded-2xl p-4 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black shadow-sm">
                        S
                    </div>
                    <div>
                        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest leading-none mb-1">Role</p>
                        <p className="text-indigo-900 font-extrabold text-xs tracking-tight italic">Operations Staff</p>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default StaffSidebar