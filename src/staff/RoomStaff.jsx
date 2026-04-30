import { useState,useEffect } from "react";
import StaffCard from '../staff/StaffCard'

const RoomStaff = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const res = await fetch('https://final-hostel-project-backend.onrender.com/api/rooms/getrooms');
      const data = await res.json();
      setRooms(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading rooms...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-indigo-900 mb-6">Staff Room Management</h2>
      
      {/* Grid container to display multiple cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <StaffCard key={room._id} room={room} />
          ))
        ) : (
          <p className="text-gray-500 italic">No rooms found.</p>
        )}
      </div>
    </div>
  );
};

export default RoomStaff;
