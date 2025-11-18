import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSalesOrders } from '../services/api'; // Assuming you have getSalesOrders

const HomePage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  // Function to load sales orders from the backend
  const loadOrders = async () => {
    try {
      setLoading(true);
      // NOTE: Replace with actual data fetching logic once API is ready
      // const data = await getSalesOrders();
      
      // Mock Data for display until the backend is fully connected
      const mockData = [
        { id: 1, invoiceNo: 'INV-001', customerName: 'Client A', invoiceDate: '2025-11-15', referenceNo: 'REF123', totalExcl: 100.00, totalTax: 10.00, totalIncl: 110.00 },
        { id: 2, invoiceNo: 'INV-002', customerName: 'Client B', invoiceDate: '2025-11-16', referenceNo: 'REF456', totalExcl: 550.50, totalTax: 55.05, totalIncl: 605.55 },
        { id: 3, invoiceNo: 'INV-003', customerName: 'Client C', invoiceDate: '2025-11-17', referenceNo: 'REF789', totalExcl: 1200.00, totalTax: 120.00, totalIncl: 1320.00 },
        { id: 4, invoiceNo: 'INV-004', customerName: 'Client D', invoiceDate: '2025-11-18', referenceNo: 'REF101', totalExcl: 875.75, totalTax: 87.58, totalIncl: 963.33 },
        { id: 5, invoiceNo: 'INV-005', customerName: 'Client E', invoiceDate: '2025-11-19', referenceNo: 'REF112', totalExcl: 450.00, totalTax: 45.00, totalIncl: 495.00 },
        { id: 6, invoiceNo: 'INV-006', customerName: 'Client F', invoiceDate: '2025-11-20', referenceNo: 'REF131', totalExcl: 2300.50, totalTax: 230.05, totalIncl: 2530.55 },
        { id: 7, invoiceNo: 'INV-007', customerName: 'Client G', invoiceDate: '2025-11-21', referenceNo: 'REF415', totalExcl: 980.00, totalTax: 98.00, totalIncl: 1078.00 }
      ];

      setOrders(mockData); // setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Handles double-click to navigate to the Sales Order page in Edit mode
  const handleRowDoubleClick = (orderId) => {
    navigate(`/sales-order/${orderId}`);
  };

  return (
    // Use a white background for the whole page
    <div className="min-h-screen bg-gray-100 p-6"> 
      {/* Outer Window Container with border matching the image */}
      <div className="max-w-7xl mx-auto border-2 border-gray-800 rounded-lg shadow-xl bg-white">
        
        {/* Window Header (Matching Image 1) */}
        <div className="bg-gray-200 border-b-2 border-gray-800 px-4 py-2 flex items-center gap-2 rounded-t-lg">
          <h1 className="flex-1 text-center text-base font-semibold">Home</h1>
        </div>

        {/* Add New Button Bar (Matching Image 2) */}
        <div className="bg-white border-b-2 border-gray-800 px-4 py-2">
          <button
            onClick={() => navigate('/sales-order')}
            className="px-4 py-1.5 bg-white border-2 border-gray-800 rounded text-sm font-medium hover:bg-gray-100 shadow-sm"
          >
            Add New
          </button>
        </div>

        {/* Table Content (Grid - Matching Image 3) */}
        <div className="p-4 overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading orders...</div>
          ) : (
            <table className="min-w-full border-collapse border border-gray-800">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-800 px-3 py-2 text-xs font-medium text-left w-24">▼ Col 1 (Invoice No)</th>
                  <th className="border border-gray-800 px-3 py-2 text-xs font-medium text-left w-32">▼ Col 2 (Customer)</th>
                  <th className="border border-gray-800 px-3 py-2 text-xs font-medium text-left w-24">▼ Col 3 (Date)</th>
                  <th className="border border-gray-800 px-3 py-2 text-xs font-medium text-left w-24">▼ Col 4 (Ref No)</th>
                  <th className="border border-gray-800 px-3 py-2 text-xs font-medium text-right w-24">▼ Col 5 (Excl)</th>
                  <th className="border border-gray-800 px-3 py-2 text-xs font-medium text-right w-24">▼ Col 6 (Tax)</th>
                  <th className="border border-gray-800 px-3 py-2 text-xs font-medium text-right w-24">▼ Col 7 (Incl)</th>
                </tr>
              </thead>
              <tbody>
                {/* Display actual order data */}
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onDoubleClick={() => handleRowDoubleClick(order.id)}
                    className="hover:bg-blue-50 cursor-pointer"
                  >
                    <td className="border border-gray-800 px-3 py-3 text-xs">{order.invoiceNo}</td>
                    <td className="border border-gray-800 px-3 py-3 text-xs">{order.customerName}</td>
                    <td className="border border-gray-800 px-3 py-3 text-xs">
                      {order.invoiceDate ? new Date(order.invoiceDate).toLocaleDateString() : ''}
                    </td>
                    <td className="border border-gray-800 px-3 py-3 text-xs">{order.referenceNo}</td>
                    <td className="border border-gray-800 px-3 py-3 text-xs text-right">{order.totalExcl.toFixed(2)}</td>
                    <td className="border border-gray-800 px-3 py-3 text-xs text-right">{order.totalTax.toFixed(2)}</td>
                    <td className="border border-gray-800 px-3 py-3 text-xs text-right">{order.totalIncl.toFixed(2)}</td>
                  </tr>
                ))}
                {/* Fill empty rows to match the screenshot visually, if less than 7 orders */}
                {[...Array(Math.max(0, 7 - orders.length))].map((_, index) => (
                    <tr key={`empty-${index}`} className="hover:bg-gray-50">
                        <td className="border border-gray-800 px-3 py-3 text-xs text-gray-400 opacity-0">.</td>
                        <td className="border border-gray-800 px-3 py-3 text-xs text-gray-400 opacity-0">.</td>
                        <td className="border border-gray-800 px-3 py-3 text-xs text-gray-400 opacity-0">.</td>
                        <td className="border border-gray-800 px-3 py-3 text-xs text-gray-400 opacity-0">.</td>
                        <td className="border border-gray-800 px-3 py-3 text-xs text-gray-400 opacity-0">.</td>
                        <td className="border border-gray-800 px-3 py-3 text-xs text-gray-400 opacity-0">.</td>
                        <td className="border border-gray-800 px-3 py-3 text-xs text-gray-400 opacity-0">.</td>
                    </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {!loading && orders.length === 0 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">No orders found. Click "Add New" to create your first sales order.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;