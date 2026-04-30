import { NavLink } from "react-router-dom"
import { LayoutDashboard, BedDouble, Users, CreditCard, Wrench, Receipt, BarChart3 } from 'lucide-react'

const AdminSidebar = () => {
    // White background theme: Indigo for active points
    const linkClass = ({ isActive }) =>
        `flex items-center space-x-4 py-3 px-4 rounded-lg transition-all duration-200 ${
            isActive 
            ? 'bg-indigo-600 text-white shadow-md font-bold' 
            : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-900' 
        }`;

    return (
        <div className="bg-white h-screen fixed left-0 top-20 bottom-0 w-25 sm:w-45 md:w-64 shadow-xl flex flex-col">
         
            <nav className="flex-1 pt-10 px-4 sm:px-4 sm:pt-6 space-y-2 overflow-y-auto">
                <NavLink to="/admin-dashboard" className={linkClass} end>
                    <LayoutDashboard size={22} />
                    <span className="text-sm tracking-wide hidden sm:block">Dashboard</span>
                </NavLink>

                <NavLink to="/admin-dashboard/rooms" className={linkClass}>
                    <BedDouble size={22} />
                    <span className="text-sm tracking-wide hidden sm:block">Rooms</span>
                </NavLink>

                <NavLink to="/admin-dashboard/tenants" className={linkClass}>
                    <Users size={22} />
                    <span className="text-sm tracking-wide hidden sm:block">Tenants</span>
                </NavLink>

                <NavLink to="/admin-dashboard/payments" className={linkClass}>
                    <CreditCard size={22} />
                    <span className="text-sm tracking-wide hidden sm:block ">Payments</span>
                </NavLink>

                <NavLink to="/admin-dashboard/maintenance" className={linkClass}>
                    <Wrench size={22} />
                    <span className="text-sm tracking-wide hidden sm:block">Maintenance</span>
                </NavLink>

                <NavLink to="/admin-dashboard/expenses" className={linkClass}>
                    <Receipt size={22} />
                    <span className="text-sm tracking-wide hidden sm:block">Expenses</span>
                </NavLink>

                <NavLink to="/admin-dashboard/reports" className={linkClass}>
                    <BarChart3 size={22} />
                    <span className="text-sm tracking-wide hidden sm:block">Reports</span>
                </NavLink>
            </nav>
        </div>
    )
}

export default AdminSidebar;