import axios from "axios";

const API_BASE_URL = "http://localhost:4444/api/avis";

export const getAvisByItem = async (itemId: string) => {
  const response = await axios.get(`${API_BASE_URL}/item/${itemId}`);
  return response.data;
};

export const getProfessorAvis = async (userId?: string) => {
  if (!userId) {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  }
  const response = await axios.get(`${API_BASE_URL}/professor/${userId}`);
  return response.data;
};


export const getResponsesByAvis = async (avisId: string) => {
  const response = await axios.get(`${API_BASE_URL}/replies/${avisId}`);
  return response.data;
};

export const deleteAvis = async (avisId: string) => {
  const response = await axios.delete(`${API_BASE_URL}/${avisId}`);
  return response.data;
};

export const createResponse = async (avisId: string, content: string, userId: string) => {
  const response = await axios.post(API_BASE_URL, {
    user_id: userId,
    content,
    type: "response",
    avis_parent_id: avisId,
    item_id: null,
  });
  return response.data;
};
