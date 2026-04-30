import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PaymentCard from '../payments/PaymentCard';
import { Wallet, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const MyPayments = () => {
  const [billData, setBillData] = useState({ unpaid: [], paid: [], pending: [] });
  const [activeTab, setActiveTab] = useState('unpaid'); // 'unpaid', 'paid', or 'pending'
  const [loading, setLoading] = useState(true);

  const authConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  useEffect(() => {
    const fetchBills = async () => {
      try {
        // Updated endpoint to match your controller
        const res = await axios.get('https://final-hostel-project-backend.onrender.com/api/billing/my-bills', authConfig);
        setBillData({
          unpaid: res.data.unpaid || [],
          paid: res.data.paid || [],
          pending: res.data.pending || []
        });
      } catch (err) {
        console.error("Error loading bills");
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  const handlePay = async (paymentId) => {
    try {
      const { data } = await axios.post(
        'https://final-hostel-project-backend.onrender.com/api/billing/create-checkout-session',
        { paymentId },
        authConfig
      );
      if (data.url) window.location.href = data.url; 
    } catch (err) {
      alert("Payment gateway is currently busy. Try again later.");
    }
  };

  // Helper to get the correct list based on active tab
  const currentBills = billData[activeTab];

  return (
    <div className="p-4 md:p-12 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-indigo-900 tracking-tight">My Invoices</h1>
            <p className="text-slate-500 font-medium">Manage your room rent and billing history</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1.5 bg-slate-200/50 rounded-2xl w-fit">
            {[
              { id: 'unpaid', label: 'Unpaid', icon: AlertCircle },
              { id: 'pending', label: 'Pending', icon: Clock },
              { id: 'paid', label: 'Paid History', icon: CheckCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-72 bg-white rounded-[2rem] animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : currentBills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentBills.map(bill => (
              <PaymentCard 
                key={bill._id} 
                payment={bill} 
                onPayClick={handlePay} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-slate-200">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-400 font-bold italic">
              No {activeTab} invoices found in your records.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPayments;