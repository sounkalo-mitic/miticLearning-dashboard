import axios from 'axios';

const API_URL = 'http://localhost:4444/api/enrollment/progress'; // Remplace par ton URL API

export const getEnrollmentProgressData = async (userId: string, period: string) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/${period}`);
    return response.data; // Retourne les données (séries et catégories)
  } catch (error) {
    console.error('Erreur lors de la récupération des données de progression des inscriptions :', error);
    throw new Error('Impossible de récupérer les données.');
  }
};
