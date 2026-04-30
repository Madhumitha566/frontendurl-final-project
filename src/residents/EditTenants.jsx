import React, { useState, useEffect } from 'react';
import  PhoneInput  from 'react-phone-number-input';
const EditTenants = ({ tenant, onClose, refreshTenants }) => {
    const [formData, setFormData] = useState({
        name: '', 
        email: '', 
        phone: '', 
        amount: '', 
        status: 'Active',
        emergencyContact: { name: '', phone: '' },
        checkInDate: '', 
        checkOutDate: '', 
        currentRoom: '' 
    });

    useEffect(() => {
        if (tenant) {
            setFormData({
                name: tenant.name || '',
                email: tenant.email || '',
                phone: tenant.phone || '',
                amount: tenant.amount || '',
                status: tenant.status || 'Active',
                emergencyContact: {
                    name: tenant.emergencyContact?.name || '',
                    phone: tenant.emergencyContact?.phone || ''
                },
                // Format dates to YYYY-MM-DD for the HTML date input
                checkInDate: tenant.checkInDate ? tenant.checkInDate.split('T')[0] : '',
                checkOutDate: tenant.checkOutDate ? tenant.checkOutDate.split('T')[0] : '',
                currentRoom: tenant.currentRoom?._id || tenant.currentRoom || ''
            });
        }
    }, [tenant]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://final-hostel-project-backend.onrender.com/api/tenants/updateuser/${tenant._id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                refreshTenants();
                onClose();
            } else {
                alert("Failed to update tenant");
            }
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Edit Tenant Profile</h2>
                        <p className="text-blue-100 text-xs mt-1">Editing details for {tenant.name}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl transition">✕</button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                    
                    {/* Basic Information Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                            <input required className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" 
                                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                            <input required type="email" className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" 
                                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div className="flex flex-col">
                         {/*    <label className="text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                            <input required type="tel" className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" 
                                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /> */}
                                 <label className="text-xs font-bold uppercase text-gray-500">Phone Number</label>
                           {/*  <input required className="w-full border p-2 rounded mt-1" type="tel"
                                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />  */}

                                <PhoneInput
        placeholder="Enter phone number"
        international
        defaultCountry="US"
        value={formData.phone}
        onChange={(value) => setFormData({ ...formData, phone: value })}
        // Styling the container and internal elements
        className="flex items-center w-full h-10  border mt-1 rounded-md bg-white overflow-hidden focus-within:ring-1 focus-within:ring-black-500 transition-all
        
        [&_.PhoneInputCountry]:bg-gray-100 
        [&_.PhoneInputCountry]:px-4
        [&_.PhoneInputCountry]:h-full 
        [&_.PhoneInputCountry]:border-r 
        [&_.PhoneInputCountry]:border-gray-300 
        [&_.PhoneInputCountry]:flex 
        [&_.PhoneInputCountry]:items-center
        
    
        [&_img]:w-6 
        [&_img]:h-auto
        

        [&_input]:flex-1 
        [&_input]:h-full 
        [&_input]:px-4 
        [&_input]:outline-none 
        [&_input]:text-sm 
        [&_input]:bg-white"
    />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                            <select className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white" 
                                value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Financials & Dates Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1">Monthly Rent (₹)</label>
                            <input type="number" className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" 
                                value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1">Check-In</label>
                            <input type="date" className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" 
                                value={formData.checkInDate} onChange={(e) => setFormData({...formData, checkInDate: e.target.value})} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1">Check-Out</label>
                            <input type="date" className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" 
                                value={formData.checkOutDate} onChange={(e) => setFormData({...formData, checkOutDate: e.target.value})} />
                        </div>
                    </div>

                    {/* Emergency Contact Section */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h3 className="text-sm font-bold text-red-600 uppercase mb-3 flex items-center gap-2">
                            🚨 Emergency Contact
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Contact Name</label>
                                <input className="border p-2 rounded-lg bg-white" 
                                    value={formData.emergencyContact.name} 
                                    onChange={(e) => setFormData({
                                        ...formData, 
                                        emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                                    })} />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Contact Phone</label>
                                <input className="border p-2 rounded-lg bg-white" 
                                    value={formData.emergencyContact.phone} 
                                    onChange={(e) => setFormData({
                                        ...formData, 
                                        emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                                    })} />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={onClose} 
                            className="px-6 py-2 text-gray-500 font-semibold hover:text-gray-700 transition">
                            Cancel
                        </button>
                        <button type="submit" 
                            className="px-10 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition">
                            Update Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTenants;