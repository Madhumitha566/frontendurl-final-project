import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditRooms = ({ room, onClose, refreshRooms }) => {
  const [formData, setFormData] = useState({
    roomnumber: '',
    floor: '',
    type: '',
    baseRent: '',
    capacity: '',
    occupancy: '',
    status: '',
    description: ''
  });

  useEffect(() => {
    if (room) {
      setFormData({
        roomnumber: room.roomnumber || '',
        floor: room.floor || '',
        type: room.type || 'Double',
        baseRent: room.baseRent || '',
        capacity: room.capacity || 1,
        occupancy: room.occupancy || 0,
        status: room.status || 'Available',
        description: room.description || ''
      });
    }
  }, [room]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple frontend validation
    if (formData.occupancy > formData.capacity) {
      alert("Occupancy cannot exceed room capacity!");
      return;
    }

    try {
      // Using axios for consistency with your AddRooms component
      const response = await axios.put(
        `https://final-hostel-project-backend.onrender.com/api/rooms/update/${room._id}`, 
        formData, 
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.status === 200) {
        refreshRooms(); 
        onClose();      
      }
    } catch (error) {
      // Check specifically for the duplicate key error from the backend
      if (error.response?.data?.message?.includes("E11000")) {
        alert("Error: This room number already exists. Please use a unique number.");
      } else {
        console.error("Update error:", error.response?.data || error.message);
        alert("Failed to update room: " + (error.response?.data?.message || "Unknown error"));
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="bg-gray-800 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Edit Room Details</h2>
            <p className="text-gray-400 text-xs mt-1">Updating Room: {room.roomnumber}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Room Number</label>
              <input 
                required 
                value={formData.roomnumber}
                className="w-full border p-2 rounded-lg mt-1 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setFormData({...formData, roomnumber: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Monthly Rent (₹)</label>
              <input 
                type="number"
                required 
                value={formData.baseRent}
                className="w-full border p-2 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setFormData({...formData, baseRent: Number(e.target.value)})} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
              <select 
                value={formData.status}
                className="w-full border p-2 rounded-lg mt-1"
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="Available">Available</option>
                <option value="Full">Full</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Room Type</label>
              <select 
                value={formData.type}
                className="w-full border p-2 rounded-lg mt-1"
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl grid grid-cols-2 gap-4 border border-blue-100">
            <div>
              <label className="text-xs font-bold text-blue-700 uppercase">Max Capacity</label>
              <input 
                type="number"
                value={formData.capacity}
                className="w-full border p-2 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})} 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-blue-700 uppercase">Current Occupancy</label>
              <input 
                type="number"
                value={formData.occupancy}
                className="w-full border p-2 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setFormData({...formData, occupancy: Number(e.target.value)})} 
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
            <textarea 
              value={formData.description}
              className="w-full border p-2 rounded-lg mt-1 h-20 outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 font-medium hover:text-gray-700">
              Cancel
            </button>
            <button type="submit" className="px-8 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition active:scale-95">
              Update Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRooms;