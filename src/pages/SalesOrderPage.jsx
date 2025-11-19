import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomers, getItems, createSalesOrder, updateSalesOrder, getSalesOrderById } from '../services/api';

const SalesOrderPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    address1: '',
    address2: '',
    address3: '',
    suburb: '',
    state: '',
    postCode: '',
    invoiceNo: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    referenceNo: '',
  });

  const initialOrderItems = Array(3).fill(null).map(() => ({ 
    itemCode: '', description: '', note: '', quantity: '', price: 0, taxRate: '', exclAmount: 0, taxAmount: 0, inclAmount: 0 
  }));
  const [orderItems, setOrderItems] = useState(initialOrderItems);

  useEffect(() => {
    loadCustomers();
    loadItems();
    if (isEditMode) {
      loadSalesOrder(id);
    }
  }, [id, isEditMode]);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const loadItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const loadSalesOrder = async (orderId) => {
    try {
      const data = await getSalesOrderById(orderId);
      setFormData({
        customerId: data.customerId,
        customerName: data.customerName,
        address1: data.address1,
        address2: data.address2,
        address3: data.address3,
        suburb: data.suburb,
        state: data.state,
        postCode: data.postCode,
        invoiceNo: data.invoiceNo,
        invoiceDate: data.invoiceDate,
        referenceNo: data.referenceNo,
      });
      
      const loadedItems = data.items || [];
      const paddedItems = loadedItems.length > 0 ? loadedItems : initialOrderItems;
      setOrderItems(paddedItems);
    } catch (error) {
      console.error('Error loading sales order:', error);
    }
  };

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    const customer = customers.find(c => c.id === parseInt(customerId));
    
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customerId: customerId,
        customerName: customer.name || '',
        address1: customer.address1 || '',
        address2: customer.address2 || '',
        address3: customer.address3 || '',
        suburb: customer.suburb || '',
        state: customer.state || '',
        postCode: customer.postCode || '',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        customerId: '',
        customerName: '',
        address1: '', address2: '', address3: '', suburb: '', state: '', postCode: '',
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index][field] = value;

    if (field === 'itemCode') {
      const item = items.find(i => i.code === value);
      if (item) {
        updatedItems[index].description = item.description;
        updatedItems[index].price = item.price;
      } else if (value === '') {
        updatedItems[index].description = '';
        updatedItems[index].price = 0;
      }
    }

    if (field === 'description') {
      const item = items.find(i => i.description === value);
      if (item) {
        updatedItems[index].itemCode = item.code;
        updatedItems[index].price = item.price;
      } else if (value === '') {
        updatedItems[index].itemCode = '';
        updatedItems[index].price = 0;
      }
    }

    const quantity = parseFloat(updatedItems[index].quantity) || 0;
    const price = parseFloat(updatedItems[index].price) || 0;
    const taxRate = parseFloat(updatedItems[index].taxRate) || 0;

    updatedItems[index].exclAmount = quantity * price;
    updatedItems[index].taxAmount = (updatedItems[index].exclAmount * taxRate) / 100;
    updatedItems[index].inclAmount = updatedItems[index].exclAmount + updatedItems[index].taxAmount;

    setOrderItems(updatedItems);
  };

  const addItemRow = () => {
    setOrderItems(prevItems => [...prevItems, { 
      itemCode: '', description: '', note: '', quantity: '', price: 0, 
      taxRate: '', exclAmount: 0, taxAmount: 0, inclAmount: 0 
    }]);
  };

  const calculateTotals = () => {
    const totalExcl = orderItems.reduce((sum, item) => sum + (item.exclAmount || 0), 0);
    const totalTax = orderItems.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
    const totalIncl = orderItems.reduce((sum, item) => sum + (item.inclAmount || 0), 0);
    return { totalExcl, totalTax, totalIncl };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const orderData = {
      ...formData,
      items: orderItems.filter(item => item.itemCode && parseFloat(item.quantity) > 0),
    };

    if (orderData.items.length === 0) {
      alert('Please add at least one item to the sales order.');
      return;
    }

    try {
      if (isEditMode) {
        await updateSalesOrder(id, orderData);
        alert('Order updated successfully!');
      } else {
        await createSalesOrder(orderData);
        alert('Order created successfully!');
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Error saving order. Please try again.');
    }
  };

  const { totalExcl, totalTax, totalIncl } = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto border-2 border-gray-800 rounded-lg shadow-xl bg-white">
        <div className="bg-gray-200 border-b-2 border-gray-800 px-4 py-2 flex items-center gap-2 rounded-t-lg">
          <h1 className="flex-1 text-center text-base font-semibold">Sales Order</h1>
        </div>

        <div className="bg-white border-b-2 border-gray-800 px-4 py-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-1.5 bg-white border-2 border-gray-800 rounded shadow-sm hover:bg-gray-100"
          >
            <span className="text-lg">✓</span>
            <span className="text-sm font-medium">Save Order</span>
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="w-28 text-sm font-medium">Customer Name</label>
                  <select
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleCustomerChange}
                    required
                    className="flex-1 px-2 py-1 border border-gray-800 text-sm bg-white cursor-pointer"
                  >
                    <option value="">Select Customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-28 text-sm font-medium">Address 1</label>
                  <input type="text" name="address1" value={formData.address1} onChange={handleInputChange} className="flex-1 px-2 py-1 border border-gray-800 text-sm" />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-28 text-sm font-medium">Address 2</label>
                  <input type="text" name="address2" value={formData.address2} onChange={handleInputChange} className="flex-1 px-2 py-1 border border-gray-800 text-sm" />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-28 text-sm font-medium">Address 3</label>
                  <input type="text" name="address3" value={formData.address3} onChange={handleInputChange} className="flex-1 px-2 py-1 border border-gray-800 text-sm" />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-28 text-sm font-medium">Suburb</label>
                  <input type="text" name="suburb" value={formData.suburb} onChange={handleInputChange} className="flex-1 px-2 py-1 border border-gray-800 text-sm" />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-28 text-sm font-medium">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="flex-1 px-2 py-1 border border-gray-800 text-sm" />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-28 text-sm font-medium">Post Code</label>
                  <input type="text" name="postCode" value={formData.postCode} onChange={handleInputChange} className="flex-1 px-2 py-1 border border-gray-800 text-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="w-28 text-sm font-medium">Invoice No.</label>
                  <input type="text" name="invoiceNo" value={formData.invoiceNo} onChange={handleInputChange} required className="flex-1 px-2 py-1 border border-gray-800 text-sm" />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-28 text-sm font-medium">Invoice Date</label>
                  <input type="date" name="invoiceDate" value={formData.invoiceDate} onChange={handleInputChange} required className="flex-1 px-2 py-1 border border-gray-800 text-sm" />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-28 text-sm font-medium">Reference no</label>
                  <input type="text" name="referenceNo" value={formData.referenceNo} onChange={handleInputChange} className="flex-1 px-2 py-1 border border-gray-800 text-sm" />
                </div>

                <div className="pt-4">
                  <textarea className="w-full h-32 px-2 py-1 border border-gray-800 text-sm resize-none" placeholder="Notes..."></textarea>
                </div>
              </div>
            </div>

            <div className="mb-6 overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-800">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-800 px-2 py-2 text-xs font-semibold text-left w-24">Item Code</th>
                    <th className="border border-gray-800 px-2 py-2 text-xs font-semibold text-left w-32">Description</th>
                    <th className="border border-gray-800 px-2 py-2 text-xs font-semibold text-left w-24">Note</th>
                    <th className="border border-gray-800 px-2 py-2 text-xs font-semibold text-center w-20">Quantity</th>
                    <th className="border border-gray-800 px-2 py-2 text-xs font-semibold text-right w-20">Price</th>
                    <th className="border border-gray-800 px-2 py-2 text-xs font-semibold text-center w-16">Tax</th>
                    <th className="border border-gray-800 px-2 py-2 text-xs font-semibold text-right w-24">Excl Amount</th>
                    <th className="border border-gray-800 px-2 py-2 text-xs font-semibold text-right w-24">Tax Amount</th>
                    <th className="border border-gray-800 px-2 py-2 text-xs font-semibold text-right w-24">Incl Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-800 p-0">
                        <select value={item.itemCode} onChange={(e) => handleItemChange(index, 'itemCode', e.target.value)} className="w-full px-2 py-2 text-xs border-0 bg-white">
                          <option value=""></option>
                          {items.map((i, idx) => (<option key={idx} value={i.code}>{i.code}</option>))}
                        </select>
                      </td>
                      <td className="border border-gray-800 p-0">
                        <select value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="w-full px-2 py-2 text-xs border-0 bg-white">
                          <option value=""></option>
                          {items.map((i, idx) => (<option key={idx} value={i.description}>{i.description}</option>))}
                        </select>
                      </td>
                      <td className="border border-gray-800 p-0">
                        <input type="text" value={item.note} onChange={(e) => handleItemChange(index, 'note', e.target.value)} className="w-full px-2 py-2 text-xs border-0" />
                      </td>
                      <td className="border border-gray-800 p-0">
                        <input type="number" step="0.01" min="0" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="w-full px-2 py-2 text-xs text-center border-0" />
                      </td>
                      <td className="border border-gray-800 p-0">
                        <input type="text" value={item.price > 0 ? item.price.toFixed(2) : ''} readOnly className="w-full px-2 py-2 text-xs text-right border-0 bg-gray-100" />
                      </td>
                      <td className="border border-gray-800 p-0">
                        <input type="number" step="0.01" min="0" value={item.taxRate} onChange={(e) => handleItemChange(index, 'taxRate', e.target.value)} className="w-full px-2 py-2 text-xs text-center border-0" />
                      </td>
                      <td className="border border-gray-800 px-2 py-2 text-xs text-right bg-gray-50">{item.exclAmount.toFixed(2)}</td>
                      <td className="border border-gray-800 px-2 py-2 text-xs text-right bg-gray-50">{item.taxAmount.toFixed(2)}</td>
                      <td className="border border-gray-800 px-2 py-2 text-xs text-right bg-gray-50">{item.inclAmount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" onClick={addItemRow} className="mt-2 px-3 py-1 text-xs bg-gray-100 border border-gray-800 rounded shadow-sm hover:bg-gray-200">+ Add Row</button>
            </div>

            <div className="flex justify-end">
              <div className="w-96 space-y-1">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-right flex-1">Total Excl</span>
                  <input type="text" value={totalExcl.toFixed(2)} readOnly className="w-40 px-2 py-1 text-sm text-right border border-gray-800 bg-gray-50 font-semibold" />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-right flex-1">Total Tax</span>
                  <input type="text" value={totalTax.toFixed(2)} readOnly className="w-40 px-2 py-1 text-sm text-right border border-gray-800 bg-gray-50 font-semibold" />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-right flex-1">Total Incl</span>
                  <input type="text" value={totalIncl.toFixed(2)} readOnly className="w-40 px-2 py-1 text-sm text-right border-2 border-gray-800 bg-gray-100 font-bold" />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SalesOrderPage;