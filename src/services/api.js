import axios from 'axios';

// Backend API URL
const API_BASE_URL = 'https://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customers API calls
export const getCustomers = async () => {
  const response = await apiClient.get('/customers');
  return response.data;
};

export const getCustomerById = async (id) => {
  const response = await apiClient.get(`/customers/${id}`);
  return response.data;
};

// Items API calls
export const getItems = async () => {
  const response = await apiClient.get('/items');
  return response.data;
};

// Sales Orders API calls
export const getSalesOrders = async () => {
  const response = await apiClient.get('/salesorders');
  return response.data;
};

export const getSalesOrderById = async (id) => {
  const response = await apiClient.get(`/salesorders/${id}`);
  return response.data;
};

export const createSalesOrder = async (orderData) => {
  const response = await apiClient.post('/salesorders', orderData);
  return response.data;
};

export const updateSalesOrder = async (id, orderData) => {
  const response = await apiClient.put(`/salesorders/${id}`, orderData);
  return response.data;
};

export const deleteSalesOrder = async (id) => {
  const response = await apiClient.delete(`/salesorders/${id}`);
  return response.data;
};

export default apiClient;