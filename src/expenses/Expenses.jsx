import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { Plus, IndianRupee, Calendar, TrendingUp, Loader2, X } from 'lucide-react';
import ExpenseUI from './ExpenseUI';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

const Expenses = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [editingId, setEditingId] = useState(null); // Tracks if we are editing
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Maintenance',
    date: new Date().toISOString().split('T')[0],
    description: '',
    vendor: ''
  });
  
  const fetchStats = async () => {
    try {
      const res = await axios.get('https://final-hostel-project-backend.onrender.com/api/expenses/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setData(res.data);
    } catch (err) {
      console.error("Error fetching stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- REFACTORED SUBMIT LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingId) {
        // UPDATE: Call the PUT route
        await axios.put(`https://final-hostel-project-backend.onrender.com/api/expenses/update/${editingId}`, formData, config);
      } else {
        // CREATE: Call the POST route
        await axios.post('https://final-hostel-project-backend.onrender.com/api/expenses/add', formData, config);
      }

      handleCloseModal();
      fetchStats(); 
    } catch (err) {
      alert("Error saving expense: " + err.response?.data?.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ 
      title: '', 
      amount: '', 
      category: 'Maintenance', 
      date: new Date().toISOString().split('T')[0],
      description: '',
      vendor: ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record permanently?")) {
      try {
        await axios.delete(`https://final-hostel-project-backend.onrender.com/api/expenses/delete/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchStats(); 
      } catch (err) {
        alert("Error deleting: " + err.response?.data?.message);
      }
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id); 
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: new Date(expense.date).toISOString().split('T')[0],
      description: expense.description || '',
      vendor: expense.vendor || ''
    });
    setShowModal(true);
  };

  const filteredExpenses = data?.rawExpenses?.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || exp.category === filterCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      {/* HEADER */}
      <div className="flex flex-row  justify-between items-center mb-8">
        <div>
          <h1 className=" text-xl sm:text-2xl font-black text-indigo-900 uppercase tracking-tight">Expense Management</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Operational Oversight</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5   rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-200 font-bold text-xs md:text-sm"
        >
          <Plus size={18} /> Add Expense
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Total Expenses" value={data?.allTime} sub="All time" color="bg-red-500" icon={<IndianRupee />} />
        <Card title="This Month" value={data?.thisMonth} sub="Current month" color="bg-orange-500" icon={<Calendar />} />
        <Card title="Monthly Change" value="+0.0%" sub="vs last month" color="bg-purple-600" icon={<TrendingUp />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Charts remain the same... */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full">
           <h3 className="text-lg font-black text-slate-800 mb-1">Expense Categories</h3>
           <div className="h-64 mt-6">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={data?.categoryData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                   {data?.categoryData?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-6">
            {data?.categoryData?.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {item.name}
              </div>
            ))}
          </div>

        </div>
        
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-slate-800 mb-1">Monthly Trend</h3>
          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} tick={{fontWeight: 'bold'}} />
                <YAxis fontSize={10} tick={{fontWeight: 'bold'}} />
                <Tooltip />
                <Bar dataKey="amount" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* LIST UI */}
      <ExpenseUI 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        expenses={filteredExpenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative">
            <button onClick={handleCloseModal} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
            <h2 className="text-xl font-black text-slate-800 uppercase mb-6 tracking-tight">
              {editingId ? "Edit Expense" : "Add New Expense"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Title</label>
                <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-400 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Amount (₹)</label>
                  <input required name="amount" type="number" value={formData.amount} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-400 transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-400 transition-colors">
                    <option value="Maintenance">Maintenance</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Staff">Staff</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Date</label>
                <input name="date" type="date" value={formData.date} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-400 transition-colors" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg mt-4">
                {editingId ? "Update Expense" : "Save Expense"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Card = ({ title, value, sub, color, icon }) => (
  <div className={`${color} p-7 rounded-[2rem] text-white relative overflow-hidden shadow-xl transition-transform hover:scale-[1.02]`}>
    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{title}</p>
    <h2 className="text-3xl font-black mt-2">₹{typeof value === 'number' ? value.toLocaleString() : value}</h2>
    <p className="text-[10px] font-bold uppercase mt-2 opacity-60 tracking-tighter">{sub}</p>
    <div className="absolute right-[-10px] bottom-[-10px] opacity-10 scale-[2.5]">
      {icon}
    </div>
  </div>
);

export default Expenses;