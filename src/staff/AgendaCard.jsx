import React from 'react';
import { Phone, DoorOpen } from 'lucide-react';

const AgendaCard = ({ item, type, color }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
      <div>
        <p className="font-bold text-slate-800 capitalize">{item.name}</p>
        <div className="flex gap-4 mt-1 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1">
            <DoorOpen size={12} /> Room {item.currentRoom?.roomnumber || 'N/A'}
          </span>
          <span className="flex items-center gap-1">
            <Phone size={12} /> {item.phone}
          </span>
        </div>
      </div>
      <button 
        className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-xs font-bold uppercase transition-all active:scale-95 shadow-sm
          ${color === 'green' 
            ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-100' 
            : 'bg-red-600 text-white hover:bg-red-700 shadow-red-100'}`}
      >
        Confirm {type}
      </button>
    </div>
  );
};

export default AgendaCard;