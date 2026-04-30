import TenantSidebar from '../residents/TenantSidebar';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
const ResidentDashboard = () => {

  return (
       <div className="flex">
           <TenantSidebar />
           <div className="flex-1 ml-30 sm:ml-45 md:ml-64 "> {/* Sidebar offset */}
            <Navbar />
            <main className="pt-5 bg-gray-50"> 
             <Outlet /> 
          </main>
      </div>
    </div>
  );
};

export default ResidentDashboard;