const RoomsList = ({ room, onEdit, onDelete }) => {
  // Guard clause: prevent crash if room data is missing
  if (!room) return null;

  // 1. Logic: Determine the DISPLAY status
  const isMaintenance = room.status === 'Under Maintenance';
  const isFull = room.occupancy >= room.capacity;
  const isPartial = room.occupancy > 0 && room.occupancy < room.capacity;

  let displayStatus = 'Available';
  if (isMaintenance) {
    displayStatus = 'Under Maintenance';
  } else if (isFull) {
    displayStatus = 'Full';
  } else if (isPartial) {
    displayStatus = 'Partial';
  }

  // 2. Styling Config (Matches the displayStatus)
  const statusConfig = {
    'Available': 'bg-green-100 text-green-700 border-green-200',
    'Full': 'bg-blue-100 text-blue-700 border-blue-200',
    'Partial':'bg-violet-100 text-violet-700 border-violet-200',
    'Under Maintenance': 'bg-red-100 text-red-700 border-red-200'
  };

  // 3. Math & Helpers
  const occupancyRate = room.capacity > 0 ? (room.occupancy / room.capacity) * 100 : 0;

  return (
    <div className="border border-gray-200 rounded-xl p-5 shadow-sm bg-white hover:shadow-md transition-shadow">
      
      {/* Header: Room Number and Status Badge */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-xl text-gray-800">Room {room.roomnumber}</h3>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Floor {room.floor}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${statusConfig[displayStatus] || 'bg-gray-100 text-gray-600'}`}>
          {displayStatus}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-500 text-sm mb-4 line-clamp-2 italic">
        {room.description || "No description provided for this room."}
      </p>

      {/* Room Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm border-t border-b py-4 my-4">
        <div>
          <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-tighter">Type</span>
          <span className="font-semibold text-gray-700">{room.type}</span>
        </div>
        <div>
          <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-tighter">Monthly Rent</span>
          <span className="font-semibold text-gray-700">₹{room.baseRent} </span>
        </div>
      </div>

      {/* Occupancy Progress Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-gray-600">Occupancy</span>
          <span className="text-xs font-bold text-gray-800">{room.occupancy} / {room.capacity} Beds</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${isFull ? 'bg-blue-600' : isPartial ? 'bg-violet-500' : 'bg-green-500'}`} 
            style={{ width: `${Math.min(occupancyRate, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <button 
          onClick={() => onEdit(room)}
          className="flex-1 bg-white border border-gray-300 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition active:scale-95"
        >
          Edit Details
        </button>
        <button 
          onClick={() => onDelete(room._id)}
          className="px-4 border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition active:scale-95 flex items-center justify-center"
          aria-label="Delete room"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default RoomsList;
