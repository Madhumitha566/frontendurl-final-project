import React from 'react';
import { 
  CreditCard, 
  Calendar, 
  Home, 
  User, 
  PlusCircle, 
  CheckCircle, 
  AlertCircle, 
  Clock // Added missing import
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const PaymentCard = ({ payment, onPayClick }) => {
  const {
    _id,
    tenantId,
    roomId,
    billingMonth,
    baseRent,
    utilities,
    additionalServices,
    discount,
    lateFee,
    totalAmount,
    status: dbStatus // Renamed to avoid shadowing
  } = payment;
  const isPaid = dbStatus === 'Paid';

  const getDisplayStatus = () => {
     if (isPaid) return "Paid";

    const tenantStatus = tenantId?.status?.trim();
    if (tenantStatus === 'Inactive') return "Unpaid";
    if (tenantStatus === 'Active') return "Pending";
    
    return "Pending";
  }
  const displayStatus = getDisplayStatus();

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group">
      {/* Top Section: Month & Status */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
            <Calendar size={20} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 leading-none">{billingMonth}</h4>
            <span className="text-[10px] text-gray-400 uppercase font-extrabold tracking-widest">Billing Period</span>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
          isPaid ? 'bg-green-50 text-green-600 border-green-100' : 'bg-rose-50 text-rose-600 border-rose-100'
        }`}>
          {isPaid ? <CheckCircle size={12} /> : displayStatus === 'Pending' ? <Clock size={12} /> : <AlertCircle size={12} />}
          {displayStatus}
        </div>
      </div>

      {/* Tenant Info */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-gray-600">
          <User size={16} className="text-gray-300" />
          <span className="text-sm font-semibold">{tenantId?.name || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Home size={16} className="text-gray-300" />
          <span className="text-sm font-medium">Room {roomId?.roomnumber || "Unassigned"}</span>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5 mb-6">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Base Rent</span>
          <span className="font-bold text-gray-700">₹{baseRent}</span>
        </div>
        
        {utilities > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Utilities</span>
            <span className="font-bold text-gray-700">₹{utilities}</span>
          </div>
        )}

        {additionalServices?.map((service, idx) => (
          <div key={idx} className="flex justify-between text-xs">
            <span className="text-gray-500 flex items-center gap-1">
              <PlusCircle size={10} className="text-indigo-400" /> {service.serviceName}
            </span>
            <span className="font-bold text-gray-700">₹{service.cost}</span>
          </div>
        ))}

        <div className="border-t border-gray-200 my-1 pt-2">
          {lateFee > 0 && (
            <div className="flex justify-between text-xs text-rose-500 font-medium">
              <span>Late Fee</span>
              <span>+ ₹{lateFee}</span>
            </div>
          )}
          {discount > 0 && (
            <div className="flex justify-between text-xs text-emerald-600 font-medium">
              <span>Discount</span>
              <span>- ₹{discount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Total & Pay Button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Amount Due</p>
          <p className="text-2xl font-black text-indigo-600">₹{totalAmount}</p>
        </div>
        
        {!isPaid && (
          <button 
            onClick={() => onPayClick(_id)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <CreditCard size={18} />
            Pay
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentCard;