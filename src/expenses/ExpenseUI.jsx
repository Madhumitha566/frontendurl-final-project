import React from 'react';
import { Search, Filter, Calendar, CreditCard, Edit3, Trash2 } from 'lucide-react';

const ExpenseUI = ({ 
  searchTerm, 
  setSearchTerm, 
  filterCategory, 
  setFilterCategory, 
  expenses, 
  onEdit,    // Added prop
  onDelete   // Added prop
}) => {
  
  const getCategoryStyles = (category) => {
    const styles = {
      Utilities: "bg-red-50 text-red-600 border border-red-100",
      Maintenance: "bg-blue-50 text-blue-600 border border-blue-100",
      Supplies: "bg-green-50 text-green-600 border border-green-100",
      Staff: "bg-orange-50 text-orange-600 border border-orange-100",
      Others: "bg-purple-50 text-purple-600 border border-purple-100",
    };
    return styles[category] || "bg-slate-50 text-slate-600 border border-slate-100";
  };

  return (
    <div className="space-y-6 mt-8">
      {/* --- SEARCH & FILTER BAR --- */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by title..."
            className="w-3/4 bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative min-w-[180px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select 
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-8 text-sm font-bold text-slate-600 appearance-none outline-none cursor-pointer shadow-sm"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Utilities">Utilities</option>
            <option value="Supplies">Supplies</option>
            <option value="Staff">Staff</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>

      {/* --- EXPENSE CARDS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <div key={expense._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <div className="max-w-[65%]">
                  <h4 className="font-black text-slate-800 text-lg leading-tight truncate">{expense.title}</h4>
                  <p className="text-gray-400 text-[11px] mt-1 font-medium line-clamp-1">
                    {expense.description || "Operational Expense"}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${getCategoryStyles(expense.category)}`}>
                  {expense.category}
                </span>
              </div>

              <div className="text-2xl font-black text-red-600 mb-4">
                ₹{expense.amount?.toLocaleString()}
              </div>

              <div className="space-y-2 mb-6 border-t border-slate-50 pt-4">
                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase">
                  <Calendar size={14} className="text-slate-300" /> 
                  {new Date(expense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase">
                  <CreditCard size={14} className="text-slate-300" /> 
                  {expense.paymentMethod || 'Online Payment'}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 border-t border-slate-50 pt-4">
                <button 
                  onClick={() => onEdit(expense)} // Trigger Edit Modal
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-[10px] font-black uppercase transition-colors"
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button 
                  onClick={() => onDelete(expense._id)} // Trigger Delete API
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No expenses found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseUI;