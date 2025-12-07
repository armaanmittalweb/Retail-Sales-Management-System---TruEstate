import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export async function fetchSales(params) {
  const response = await axios.get(`${API_BASE_URL}/api/sales`, {
    params,
  });
  return response.data;
}

export async function fetchFilterOptions() {
  const response = await axios.get(`${API_BASE_URL}/api/sales/filters`);
  return response.data;
}
