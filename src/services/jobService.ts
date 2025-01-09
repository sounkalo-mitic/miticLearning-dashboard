import axios from "axios";

const API_URL = "http://localhost:4444/api/job";

export const getAllJobs = async (): Promise<any> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createJob = async (data: { name: string; description?: string }) => {
  return await axios.post(API_URL, data);
};

export const updateJob = async (id: string, data: { name: string; description?: string }) => {
  return await axios.put(`${API_URL}/${id}`, data);
};

export const getJobById = async (id: string) => {
  return await axios.get(`${API_URL}/${id}`);
};

export const deleteJob = async (id: string) => {
  return await axios.delete(`${API_URL}/${id}`);
};