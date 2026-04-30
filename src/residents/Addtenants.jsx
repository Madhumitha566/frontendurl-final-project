import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'react-phone-number-input';
const Addtenants = ({ onClose, refreshTenants }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '', // Phone field
        amount: '', 
        status: 'Active',
        emergencyContact: { name: '', phone: '' },
        currentRoom: '',
        checkInDate: '',
        checkOutDate: '',
    });
    const [availableRooms, setAvailableRooms] = useState([]);

    useEffect(() => {
        const fetchAvailable = async () => {
            try {
                // Adjust this URL to match your router (/api/tenants/available)
                const res = await fetch('https://final-hostel-project-backend.onrender.com/api/tenants/available', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const data = await res.json();
                setAvailableRooms(data);
            } catch (err) {
                console.error("Error loading rooms:", err);
            }
        };
        fetchAvailable();
    }, []);

    const handleRoomChange = (roomId) => {
        const selectedRoom = availableRooms.find(r => r._id === roomId);
        setFormData({
            ...formData,
            currentRoom: roomId,
            amount: selectedRoom ? selectedRoom.baseRent : '' 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.phone || !isValidPhoneNumber(formData.phone)) {
        alert("The tenant's phone number is invalid. Please include the country code.");
        return; 
    }
        try {
            const response = await fetch('https://final-hostel-project-backend.onrender.com/api/tenants/createtenant', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                refreshTenants();
                onClose();
            } else {
                const errData = await response.json();
                alert(errData.error || "Failed to create tenant");
            }
        } catch (err) {
            console.error("Submit error:", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl overflow-y-auto max-h-[90vh]">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Register New Tenant</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Room Selection */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <label className="text-sm font-bold text-blue-800">Assign Room *</label>
                        <select 
                            required
                            className="w-full border p-2 rounded mt-1 bg-white"
                            value={formData.currentRoom}
                            onChange={(e) => handleRoomChange(e.target.value)}
                        >
                            <option value="">-- Select Vacant Room --</option>
                            {availableRooms.map((room) => (
                                <option key={room._id} value={room._id}>
                                    Room {room.roomnumber} - {room.type} (₹{room.baseRent})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Main Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold uppercase text-gray-500">Full Name</label>
                            <input required className="w-full border p-2 rounded mt-1" type="text" 
                                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-gray-500">Monthly Rent (Auto)</label>
                            <input readOnly className="w-full border p-2 rounded mt-1 bg-gray-50 font-bold text-blue-600" 
                                type="number" value={formData.amount} />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-gray-500">Email Address</label>
                            <input required className="w-full border p-2 rounded mt-1" type="email" 
                                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-gray-500">Phone Number</label>
                           {/*  <input required className="w-full border p-2 rounded mt-1" type="tel"
                                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />  */}

                                <PhoneInput
        placeholder="Enter phone number"
        international
        defaultCountry="IN"
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
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Password</label>
                            <input required className="w-full border p-2 rounded mt-1" type="password" 
                                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                        </div>
                       

                    {/* Emergency Contact */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-bold text-red-600 mb-2">Emergency Contact</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input placeholder="Contact Name" className="border p-2 rounded text-sm bg-white" 
                                onChange={(e) => setFormData({...formData, emergencyContact: {...formData.emergencyContact, name: e.target.value}})} />
                            <input placeholder="Contact Phone" className="border p-2 rounded text-sm bg-white" 
                                onChange={(e) => setFormData({...formData, emergencyContact: {...formData.emergencyContact, phone: e.target.value}})} />
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold uppercase text-gray-500">Check-In Date</label>
                            <input type="date" className="w-full border p-2 rounded mt-1 text-sm" required 
                                onChange={(e) => setFormData({...formData, checkInDate: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-gray-500">Check-Out Date</label>
                            <input type="date" className="w-full border p-2 rounded mt-1 text-sm" required 
                                onChange={(e) => setFormData({...formData, checkOutDate: e.target.value})} />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow-md">
                            Save Tenant
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Addtenants; 