import axios from "axios";
const API_URL = "http://localhost:4444/api/category";


export const getAllCategories = async (): Promise<any> => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

export const createCategory = async (data: { name: string; description?: string }) => {
  return await axios.post(API_URL, data);
};

export const updateCategory = async (id: string, data: { name: string; description?: string }) => {
  return await axios.put(`${API_URL}/${id}`, data);
};

export const getCategoryById = async (id: string) => {
  return await axios.get(`${API_URL}/${id}`);
};