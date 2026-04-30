import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Wallet, Clock, ReceiptText, Users } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import CreateInvoiceForm from './CreateInvoiceForm';
import PaymentCard from './PaymentCard';
import TenantPaymentHistory from './TenantPaymentHistory';

// 1. Move API URL to a variable (Use .env in production)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://final-hostel-project-backend.onrender.com';

// 2. Initialize Stripe
const stripePromise = loadStripe('pk_test_51TPdlQ3cJMgi1o9kvsqmYP7jbNFTERaIU4E4GbvlfIuBXeCAforar2uL5qLX5M5sn22J6Adh9ObEYkGH2nPRIjZI00rRJh6LLu');

const Payments = () => {
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [history, setHistory] = useState([]);

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  // Fetch all tenants
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/tenants/gettenant`, getAuthHeader());
        setTenants(res.data);
      } catch (err) {
        console.error("Tenant Fetch Error:", err);
      }
    };
    fetchTenants();
  }, []);

  // Fetch Summary & History
  const fetchTenantData = useCallback(async (tenantId) => {
    if (!tenantId) {
      setPayments([]);
      setSummaryData(null);
      setHistory([]);
      return;
    }
    setLoading(true);
    try {
      const [summaryRes, historyRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/billing/summary/${tenantId}`, getAuthHeader()),
        axios.get(`${API_BASE_URL}/api/billing/history/${tenantId}`, getAuthHeader())
      ]);

      setPayments(summaryRes.data.allPayments || []);
      setSummaryData(summaryRes.data.summary);

      const combinedHistory = [
        ...(historyRes.data.paid || []),
        ...(historyRes.data.unpaid || []),
        ...(historyRes.data.pending || [])
      ];
      setHistory(combinedHistory);
    } catch (err) {
      console.error("Data Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle Stripe Payment
  const handlePayAmount = async (paymentId) => {
    try {
      setLoading(true);
      // Ensure the endpoint matches your backend route
      const res = await axios.post(
        `${API_BASE_URL}/api/billing/create-checkout-session`,
        { paymentId },
        getAuthHeader()
      );

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error("No checkout URL received from server");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to initiate payment";
      alert(errorMsg);
      setLoading(false); // Reset loading only if redirect fails
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl md:max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-indigo-900">Billing Center</h1>
            <p className="text-gray-500 font-medium">Manage invoices and track revenue</p>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            <Users className="text-indigo-500 ml-2" size={20} />
            <select 
              className="bg-transparent font-bold text-gray-700 focus:outline-none pr-4 cursor-pointer"
              value={selectedTenant}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedTenant(id);
                fetchTenantData(id);
              }}
            >
              <option value="">Select a Tenant</option>
              {tenants.map(t => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Wallet size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Paid</p>
              <h3 className="text-2xl font-black text-gray-800">₹{summaryData?.totalPaid || 0}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
              <Clock size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Pending</p>
              <h3 className="text-2xl font-black text-gray-800">₹{summaryData?.totalPending || 0}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
              <ReceiptText size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Invoices</p>
              <h3 className="text-2xl font-black text-gray-800">{payments.length}</h3>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <CreateInvoiceForm 
            tenants={tenants} 
            onInvoiceCreated={() => fetchTenantData(selectedTenant)} 
          />
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            Active Invoices
            {selectedTenant && <span className="text-sm font-normal text-gray-400">({payments.length})</span>}
          </h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {payments.map((p) => (
                <PaymentCard 
                  key={p._id} 
                  payment={p} 
                  onPayClick={() => handlePayAmount(p._id)} 
                />
              ))}
              
              {!selectedTenant && (
                <div className="col-span-full py-16 text-center bg-gray-100/50 rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium italic">Please select a tenant to view history.</p>
                </div>
              )}
            </div>
          )}
        </section>
      
        <TenantPaymentHistory history={history} />
      </div>
    </div>
  );
};

export default Payments;