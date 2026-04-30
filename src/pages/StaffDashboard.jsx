import StaffSidebar from "../components/StaffSidebar"
import { useAuth } from "../context/authContext"
import Navbar from "../components/Navbar"
import { Outlet } from "react-router-dom"
const StaffDashboard=()=>{
    const {user,loading}=useAuth()
    return(
       <div className="flex">
            <StaffSidebar/>
            <div className="flex-1  ml-30 sm:ml-45 md:ml-64 bg-gray-100 h-screen">
             <Navbar/>
             <Outlet/>
            </div>
       </div>
    )
}
export default StaffDashboard