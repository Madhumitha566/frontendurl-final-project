import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added missing import

const AddRooms = ({ onClose, refreshRooms }) => {
  const navigate = useNavigate(); // Initialize navigate
  
  const [formData, setFormData] = useState({
    roomnumber: '',
    floor: 1,
    type: 'Double',
    amenities: [],
    baseRent: '',
    capacity: 1,
    occupancy: 0,
    status: 'Available',
    description: ''
  });

  const availableAmenities = ['Wifi', 'Ac', 'Tv', 'Parking', 'Meals'];

  const handleAmenityChange = (amenity) => {
    const updated = formData.amenities.includes(amenity)
      ? formData.amenities.filter(a => a !== amenity)
      : [...formData.amenities, amenity];
    setFormData({ ...formData, amenities: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Correct Axios POST syntax
      const response = await axios.post(
        'https://final-hostel-project-backend.onrender.com/api/rooms/createdroom', 
        formData, // Data goes here
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure 'token' is a string
          }
        }
      );

      // Check for success (Axios returns results in response.data)
      if (response.status === 200 || response.status === 201) {
        if (refreshRooms) refreshRooms();
        if (onClose) onClose();
        navigate("/admin-dashboard/rooms");
      }
    } catch (err) {
      console.error("Error creating room:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to create room");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Room</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Room Number */}
            <div>
              <label className="text-sm font-semibold">Room Number *</label>
              <input 
                required 
                className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-purple-500"
                value={formData.roomnumber}
                onChange={(e) => setFormData({...formData, roomnumber: e.target.value})} 
              />
            </div>
            {/* Floor */}
            <div>
              <label className="text-sm font-semibold">Floor *</label>
              <input 
                type="number" 
                required 
                className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-purple-500"
                value={formData.floor}
                onChange={(e) => setFormData({...formData, floor: Number(e.target.value)})} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type */}
            <div>
              <label className="text-sm font-semibold">Room Type</label>
              <select 
                className="w-full border p-2 rounded mt-1"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
              </select>
            </div>
            {/* Capacity */}
            <div>
              <label className="text-sm font-semibold">Capacity *</label>
              <input 
                type="number" 
                min="1"
                required
                value={formData.capacity} 
                className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Occupancy */}
            <div>
              <label className="text-sm font-semibold">Current Occupancy</label>
              <input 
                type="number" 
                required 
                min="0"
                max={formData.capacity}
                value={formData.occupancy}
                className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setFormData({...formData, occupancy: Number(e.target.value)})} 
              />
            </div>
            {/* Rent */}
            <div>
              <label className="text-sm font-semibold">Base Rent (Monthly) *</label>
              <input 
                type="number" 
                required 
                value={formData.baseRent}
                className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setFormData({...formData, baseRent: Number(e.target.value)})} 
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Room Status</label>
            <select 
              className="w-full border p-2 rounded mt-1"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="Available">Available</option>
              <option value="Full">Full</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>

          {/* Amenities */}
          <div>
            <label className="text-sm font-semibold">Amenities</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableAmenities.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleAmenityChange(item)}
                  className={`px-3 py-1 rounded-full text-xs border transition ${
                    formData.amenities.includes(item) 
                    ? 'bg-purple-600 text-white border-purple-600' 
                    : 'bg-white text-gray-600 border-gray-300 hover:border-purple-600'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea
              placeholder="Enter room details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 mt-1 h-24 focus:ring-2 focus:ring-purple-500 outline-none transition"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition shadow-md"
            >
              Add Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRooms;