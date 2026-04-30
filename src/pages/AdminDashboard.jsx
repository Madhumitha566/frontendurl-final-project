import AdminSidebar from "../components/AdminSidebar"
import Navbar from "../components/Navbar"
import { useAuth } from "../context/authContext"
import { Outlet } from "react-router-dom"

const AdminDashboard=()=>{
    const {user}=useAuth()
  
    return(
      // Example Layout Structure
<div className="min-h-screen bg-gray-50">
    <Navbar /> {/* Fixed at top, z-50 */}
    <div className="flex">
        <AdminSidebar /> 
        <main className="flex-1 ml-30 sm:ml-42 md:ml-64 p-1"> 
            <Outlet /> 
        </main>
    </div>
</div>
    )
}
export default AdminDashboard