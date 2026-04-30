
import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Receipt, ExternalLink } from 'lucide-react';

const PayHistory = ({ history = [] }) => {
    // Helper to get status styles and icons
    const getStatusDetails = (status) => {
        switch (status) {
            case 'Paid':
                return {
                    color: 'text-emerald-600',
                    bg: 'bg-emerald-50',
                    icon: <CheckCircle2 size={14} />,
                    label: 'Succeeded'
                };
            case 'Pending':
                return {
                    color: 'text-amber-600',
                    bg: 'bg-amber-50',
                    icon: <Clock size={14} />,
                    label: 'Pending'
                };
            default:
                return {
                    color: 'text-rose-600',
                    bg: 'bg-rose-50',
                    icon: <AlertCircle size={14} />,
                    label: 'Unpaid'
                };
        }
    };

    return (
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden mt-8">
            {/* --- HEADER --- */}
            <div className="p-4 md:p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Receipt className="text-indigo-500" size={22} /> Payment History
                </h3>
                <span className="w-fit bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-tight">
                    {history.length} Records Found
                </span>
            </div>

            <div className="w-full">
                {/* --- MOBILE VIEW: Card Layout (Hidden on Desktop) --- */}
                <div className="block md:hidden divide-y divide-gray-50">
                    {history.map((item) => {
                        const status = getStatusDetails(item.status);
                        return (
                            <div key={item._id} className="p-4 space-y-3 active:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Month</p>
                                        <p className="font-bold text-gray-800">{item.billingMonth}</p>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${status.bg} ${status.color} text-[10px] font-bold uppercase`}>
                                        {status.icon} {status.label}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Amount</p>
                                        <p className="font-black text-gray-900">₹{(item.totalAmount || 0).toLocaleString('en-IN')}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* --- DESKTOP VIEW: Table Layout (Hidden on Mobile) --- */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 text-gray-400 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">Billing Month</th>
                                <th className="px-6 py-4">Transaction Reference</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {history.map((item) => {
                                const statusStyle = getStatusDetails(item.status);
                                return (
                                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-gray-700">{item.billingMonth}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 max-w-[150px]">
                                                <p className="text-xs text-gray-400 font-mono truncate">
                                                    {item.transactionId || 'N/A'}
                                                </p>
                                                {item.transactionId && <ExternalLink size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-black text-gray-800 whitespace-nowrap">
                                            ₹{(item.totalAmount || 0).toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                                            {new Date(item.createdAt).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${statusStyle.bg} ${statusStyle.color} text-xs font-bold uppercase tracking-wider`}>
                                                {statusStyle.icon} {statusStyle.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* --- EMPTY STATE --- */}
                {history.length === 0 && (
                    <div className="py-16 md:py-24 text-center px-6">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Receipt className="text-gray-400" size={32} />
                        </div>
                        <p className="text-gray-500 font-medium">No payment records found for this period.</p>
                        <p className="text-sm text-gray-400">Transactions will appear here once processed.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayHistory;
