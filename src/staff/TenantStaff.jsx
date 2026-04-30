import { useState, useEffect } from 'react';
import TenantsList from '../residents/TenantsList';
import Addtenants from '../residents/Addtenants';
import EditTenants from '../residents/EditTenants';
import axios from 'axios'
const TenantStaff = () => {
    const [tenants, setTenants] = useState([]);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState(null);

    const fetchTenants = async () => {
        try {
            const response = await fetch('https://final-hostel-project-backend.onrender.com/api/tenants/gettenant', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            setTenants(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch tenants:", err);
        }
    };

    useEffect(() => { fetchTenants(); }, []);

    const filteredTenants = tenants.filter(tenant => {
        const roomNo = tenant.currentRoom?.roomnumber?.toString().toLowerCase() || "";
        const tenantName = tenant.name?.toLowerCase() || "";
        const searchTerm = search.toLowerCase();
        return roomNo.includes(searchTerm) || tenantName.includes(searchTerm);
    });

    const handleDelete = async (id) => {
    if (window.confirm("Delete this tenant? Room occupancy will be updated.")) {
        try {
            const res = await axios.delete(`https://final-hostel-project-backend.onrender.com/api/tenants/deletetenant/${id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            
            // Axios uses status, not .ok
            if (res.status === 200 || res.status === 204) {
                fetchTenants(); // Refresh the list
            }
        } catch (err) {
            console.error("Delete failed:", err.response?.data?.message || err.message);
            alert("Could not delete tenant.");
        }
    }
};
    const handleEdit = (tenantData) => {
        setSelectedTenant(tenantData);
        setIsEditModalOpen(true);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-indigo-900">Tenant Management</h1>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                    + Add Tenant
                </button>
            </div>

            <div className="mb-6">
                <input 
                    type="text" 
                    placeholder="Search by name or room number..."
                    className="w-full max-w-md p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTenants.map(tenant => ( 
                    <TenantsList 
                        key={tenant._id} 
                        tenant={tenant} 
                        onDelete={handleDelete} 
                        onEdit={handleEdit}
                    />
                ))}
            </div>

            {isModalOpen && (
                <Addtenants 
                    onClose={() => setIsModalOpen(false)} 
                    refreshTenants={fetchTenants} 
                />
            )} 

            {isEditModalOpen && selectedTenant && (
                <EditTenants
                    tenant={selectedTenant}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedTenant(null);
                    }} 
                    refreshTenants={fetchTenants} 
                />
            )}
        </div> 
    );

}
export default TenantStaff