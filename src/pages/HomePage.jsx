import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSalesOrders, deleteSalesOrder } from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getSalesOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRowDoubleClick = (orderId) => {
    navigate(`/sales-order/${orderId}`);
  };

  const handleDelete = async (orderId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteSalesOrder(orderId);
        alert('Order deleted successfully!');
        loadOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Error deleting order.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto border-2 border-gray-800 rounded-lg shadow-xl bg-white">
        <div className="bg-gray-200 border-b-2 border-gray-800 px-4 py-2 flex items-center gap-2 rounded-t-lg">
          <h1 className="flex-1 text-center text-base font-semibold">Home</h1>
        </div>

        <div className="bg-white border-b-2 border-gray-800 px-4 py-2">
          <button
            onClick={() => navigate('/sales-order')}
            className="px-4 py-1.5 bg-white border-2 border-gray-800 rounded text-sm font-medium hover:bg-gray-100 shadow-sm"
          >
            Add New
          </button>
        </div>

        <div className="p-4 overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading orders...</div>
          ) : (
            <table className="min-w-full border-collapse border border-gray-800">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-800 px-3 py-2 text-xs font-medium text-left w-24">Invoice No</th>
                  <th className="border border-gray-800 px-3 py-2 text-xs font-medium text-left w-32">Customer</th>
                  <th className="border border-gray-800 px-3 py-2 text-xs font-medium text-left w-24">Date</th>
                  <th className="border border-gray-800 px-3 py-2 text-xs font-medium text-left w-24">Ref No</th>
                  <th className="border border-gray-800 px-3 py-2 text-xs font-medium text-right w-24">Excl</th>
                  <th className="border border-gray-800 px-3 py-2 text-xs font-medium text-right w-24">Tax</th>
                  <th className="border border-gray-800 px-3 py-2 text-xs font-medium text-right w-24">Incl</th>
                  <th className="border border-gray-800 px-3 py-2 text-xs font-medium text-center w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
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
                      <td className="border border-gray-800 px-3 py-3 text-xs text-right">{order.totalExcl?.toFixed(2)}</td>
                      <td className="border border-gray-800 px-3 py-3 text-xs text-right">{order.totalTax?.toFixed(2)}</td>
                      <td className="border border-gray-800 px-3 py-3 text-xs text-right">{order.totalIncl?.toFixed(2)}</td>
                      <td className="border border-gray-800 px-3 py-3 text-xs text-center">
                        <button
                          onClick={() => handleRowDoubleClick(order.id)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => handleDelete(order.id, e)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  [...Array(7)].map((_, index) => (
                    <tr key={`empty-${index}`} className="hover:bg-gray-50">
                      <td className="border border-gray-800 px-3 py-3 text-xs text-gray-400">,,</td>
                      <td className="border border-gray-800 px-3 py-3 text-xs text-gray-400">,,</td>
                      <td className="border border-gray-800 px-3 py-3 text-xs text-gray-400">,,</td>
                      <td className="border border-gray-800 px-3 py-3 text-xs text-gray-400">,,</td>
                      <td className="border border-gray-800 px-3 py-3 text-xs text-gray-400">,,</td>
                      <td className="border border-gray-800 px-3 py-3 text-xs text-gray-400">,,</td>
                      <td className="border border-gray-800 px-3 py-3 text-xs text-gray-400">,,</td>
                      <td className="border border-gray-800 px-3 py-3 text-xs text-gray-400">,,</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
          
          {!loading && orders.length === 0 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">No orders found. Click "Add New" to create your first sales order.</p>
              <p className="text-xs text-gray-500 mt-2">💡 Tip: Double-click on any row to edit the order.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;