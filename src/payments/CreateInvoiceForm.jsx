import React, { useState } from 'react';
import axios from 'axios';

const CreateInvoiceForm = ({ tenants, onInvoiceCreated }) => {
  // 1. Define the initial state structure
  const initialState = {
    tenantId: '',
    roomId: '',
    roomDisplay: '', // Resetting the display text
    billingMonth: '',
    baseRent: '',
    utilities: 0,
    discount: 0,
    lateFee: 0,
    additionalServices: []
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tenantId') {
      const selectedTenant = tenants.find(t => t._id === value);
      setFormData({
        ...formData,
        tenantId: value,
        roomId: selectedTenant?.currentRoom?._id || '',
        roomDisplay: selectedTenant?.currentRoom?.roomnumber || 'N/A',
        baseRent: selectedTenant?.currentRoom?.baseRent || 0
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addService = () => {
    setFormData({
      ...formData,
      additionalServices: [...formData.additionalServices, { serviceName: '', cost: 0 }]
    });
  };

  const removeService = (index) => {
    const updatedServices = formData.additionalServices.filter((_, i) => i !== index);
    setFormData({ ...formData, additionalServices: updatedServices });
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.additionalServices];
    updatedServices[index][field] = field === 'cost' ? Number(value) : value;
    setFormData({ ...formData, additionalServices: updatedServices });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://final-hostel-project-backend.onrender.com/api/billing/generate', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (res.status === 201 || res.status === 200) {
        alert("Invoice Generated!");
        
        // 2. Reset form to empty values
        setFormData(initialState); 
        
        // Trigger the parent refresh logic
        onInvoiceCreated();
      }
    } catch (err) {
      console.error("Submission error:", err.response?.data || err.message);
      alert("Failed to generate invoice");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-2xl md:max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Generate Monthly Invoice</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-500 mb-1">Tenant</label>
          <select name="tenantId" className="p-2 border rounded-lg bg-gray-50" onChange={handleChange} value={formData.tenantId} required>
            <option value="">Select Tenant</option>
            {tenants.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-500 mb-1">Billing Month</label>
          {/* 3. Added value attribute so it clears visually */}
          <input type="month" name="billingMonth" className="p-2 border rounded-lg" onChange={handleChange} value={formData.billingMonth} required />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-500 mb-1">Room Number</label>
          <input type="text" value={formData.roomDisplay || ''} className="p-2 border rounded-lg bg-gray-100 font-bold" readOnly />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-500 mb-1">Base Rent</label>
          <input type="number" name="baseRent" className="p-2 border rounded-lg bg-blue-50 font-semibold" onChange={handleChange} value={formData.baseRent} required />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-500 mb-1">Utilities</label>
          <input type="number" name="utilities" className="p-2 border rounded-lg" onChange={handleChange} value={formData.utilities} />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-500 mb-1">Late Fee</label>
          <input type="number" name="lateFee" className="p-2 border rounded-lg" onChange={handleChange} value={formData.lateFee} />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-500 mb-1">Discount</label>
          <input type="number" name="discount" className="p-2 border rounded-lg text-green-600" onChange={handleChange} value={formData.discount} />
        </div>
      </div>

      <div className="mb-6 border-t pt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Additional Services</h3>
          <button type="button" onClick={addService} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold hover:bg-indigo-100 transition">
            + Add Service
          </button>
        </div>
        
        {formData.additionalServices.map((service, index) => (
          <div key={index} className="flex gap-3 mb-2 items-center animate-in fade-in slide-in-from-top-1">
            <input 
              type="text" 
              placeholder="Service Name (e.g. WiFi)" 
              className="flex-1 p-2 border rounded-lg text-sm"
              value={service.serviceName}
              onChange={(e) => handleServiceChange(index, 'serviceName', e.target.value)}
            />
            <input 
              type="number" 
              placeholder="Cost" 
              className="w-24 p-2 border rounded-lg text-sm"
              value={service.cost}
              onChange={(e) => handleServiceChange(index, 'cost', e.target.value)}
            />
            <button type="button" onClick={() => removeService(index)} className="text-red-400 hover:text-red-600 px-2">
              ✕
            </button>
          </div>
        ))}
      </div>

      <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
        Generate Invoice
      </button>
    </form>
  );
};

export default CreateInvoiceForm;