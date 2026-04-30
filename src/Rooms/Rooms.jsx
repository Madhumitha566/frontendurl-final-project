import { useState, useEffect } from 'react';
import RoomsList from '../Rooms/RoomsList';
import AddRooms from '../Rooms/AddRooms';
import EditRooms from './EditRooms';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedRoom, setSelectedRoom] = useState(null); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 const [filterStatus, setFilterStatus] = useState("All")
  const fetchRooms = async () => {
    try {
      const res = await fetch('https://final-hostel-project-backend.onrender.com/api/rooms/getrooms');
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const filteredRooms = rooms.filter(room => {
    // 1. Status Filter Logic
    const matchesStatus = filterStatus === "All" || room.status === filterStatus;

    // 2. Search Text Logic
    const searchLower = searchTerm.toLowerCase();
    const matchesRoomNumber = room.roomnumber?.toString().toLowerCase().includes(searchLower);
    const matchesTenant = room.Tenant?.some(t => 
      t.name.toLowerCase().includes(searchLower)
    );
    return matchesStatus && (matchesRoomNumber||matchesTenant);
  });

  const handleDelete = async (id) => {
    if (window.confirm("Delete this room?")) {
      const res = await fetch(`https://final-hostel-project-backend.onrender.com/api/rooms/delete/${id}`, { method: 'DELETE' });
      if (res.ok) fetchRooms(); 
    }
  };

  const handleEdit = (roomData) => {
    setSelectedRoom(roomData);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className=" text-xl sm:text-2xl font-bold text-indigo-900">Room Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-blue-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg font-small sm:font-medium hover:bg-blue-700 transition"
        >
          + Add Room
        </button>
      </div>

  <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search Input */}
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Search room #..."
            className="w-full lg:w-1/2 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Dropdown */}
        <div className="w-full md:w-48">
          <select 
            className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-400 bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Full">Full</option>
            <option value="partial">Partial</option>
            <option value="Under Maintenance"> Maintenance</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => (
          <RoomsList 
            key={room._id} 
            room={room} 
            onDelete={handleDelete} 
            onEdit={handleEdit}
          />
        ))}
      </div>

      {/* ADD ROOM MODAL (Cleaned up duplicates) */}
      {isModalOpen && (
        <AddRooms 
          onClose={() => setIsModalOpen(false)} 
          refreshRooms={fetchRooms} 
        />
      )}

      {/* EDIT ROOM MODAL */}
      {isEditModalOpen && selectedRoom && (
        <EditRooms 
          room={selectedRoom} 
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedRoom(null);
          }} 
          refreshRooms={fetchRooms} 
        />
      )}
    </div>
  );
};

export default Rooms;