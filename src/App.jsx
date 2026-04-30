import { useState } from 'react'
import './App.css'
import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import StaffDashboard from './pages/StaffDashboard'
import ResidentDashboard from './pages/ResidentDashboard'
import PrivateRoutes from './routes/PrivateRoutes'
import RolebaseRoutes from './routes/RolebaseRoutes'
import AdminSummary from './components/AdminSummary'
import Rooms from './Rooms/Rooms'
import Payments from './payments/Payments'
import Maintenance from './maintenance/Maintenance'
import Expenses from './expenses/Expenses'
import Reports from './reports/Reports'
import AddRooms from './Rooms/AddRooms'
import Tenants from './residents/Tenant'
import PaymentSuccess from './payments/PaymentSuccess'
import TenantProfile from './residents/TenantProfile'
import MaintenanceRequest from './residents/Maintenancerequest '
import MaintenanceStaff from './staff/MaintenanceStaff'
import OccupancyStaff from './staff/OccupancyStaff'
import RoomStaff from './staff/RoomStaff'
import TenantStaff from './staff/TenantStaff'
import Overview from './staff/Overview'
import MyPayments from './residents/MyPayments'
import UserPaymentHistory from './residents/UserPaymentHistory'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login"/>}></Route>
       <Route path="/login" element={<Login/>}> </Route>
       <Route path="/payment-success" element={
        <PrivateRoutes>
          <PaymentSuccess/>
        </PrivateRoutes>
        } />
       <Route path="/admin-dashboard" element={
          <PrivateRoutes> 
            <RolebaseRoutes requiredRole={["Admin"]}>
               <AdminDashboard/>
            </RolebaseRoutes>
          </PrivateRoutes>}>
           <Route index element={<AdminSummary/>}></Route>
           <Route path='/admin-dashboard/rooms' element={<Rooms/>}></Route>
           <Route path='/admin-dashboard/tenants' element={<Tenants/>}></Route> 
           <Route path='/admin-dashboard/payments' element={<Payments/>}></Route>
           <Route path='/admin-dashboard/maintenance' element={<Maintenance/>}></Route>
           <Route path='/admin-dashboard/expenses' element={<Expenses/>}></Route>
           <Route path='/admin-dashboard/reports' element={<Reports/>}></Route>
      </Route>
      <Route path="/staff-dashboard" element={
        <PrivateRoutes>
          <RolebaseRoutes requiredRole={["Staff"]}>
            <StaffDashboard/>
          </RolebaseRoutes>
          </PrivateRoutes>}>
           <Route index element={<Overview/>}></Route>
           <Route path="/staff-dashboard/occupancy" element={<OccupancyStaff/>} />
            <Route path="/staff-dashboard/rooms" element={<RoomStaff/>} />
            <Route path="/staff-dashboard/tenants" element={<TenantStaff/>} />
            <Route path="/staff-dashboard/maintenance" element={<MaintenanceStaff/>} />
        
       
      </Route>
      <Route path="/resident-dashboard" element={
          <PrivateRoutes>
            <RolebaseRoutes requiredRole={["Resident"]}>
                <ResidentDashboard />
           </RolebaseRoutes>
      </PrivateRoutes>
      }>
            <Route index element={<TenantProfile/>} ></Route>
            <Route path="/resident-dashboard/payments" element={<MyPayments/>} />
            <Route path="/resident-dashboard/history" element={<UserPaymentHistory/>} />
            <Route path="/resident-dashboard/maintenance" element={<MaintenanceRequest />} />
          </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
