import axios from "axios";
const API_URL = "http://localhost:4444/api/studyLevels";
export const getAllStudyLevels = async (): Promise<any> => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createStudyLevel = async (data: { name: string; description?: string }) => {
    return await axios.post(API_URL, data);
};

export const updateStudyLevel = async (id: string, data: { name: string; description?: string }) => {
    return await axios.put(`${API_URL}/${id}`, data);
};

export const getStudylevelById = async (id: string) => {
    return await axios.get(`${API_URL}/${id}`);
};

export const deleteStudylevel = async (id: string) => {
    return await axios.delete(`${API_URL}/${id}`);
};