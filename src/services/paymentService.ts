import axios from 'axios';

// Configuration de l'instance Axios
const apiClient = axios.create({
    baseURL: 'http://localhost:4444/api', // Remplacez par l'URL de votre API
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Service pour récupérer les paiements liés aux cours d'un professeur
 * @param {string} teacherId - L'identifiant du professeur
 * @returns {Promise<Object>} - Une promesse contenant les données des paiements ou une erreur
 */
export const getPaymentsByTeacher = async (teacherId?: string) => {
    try {
        // Vérifier si l'ID est valide
        if (teacherId) {
            // Effectuer la requête API
            const response = await apiClient.get(`/payments-teacher/${teacherId}`);
            // Retourner les données si la requête est réussie
            return response.data;
        } else {
            // Effectuer la requête API
            const response = await apiClient.get(`/payments`);
            // Retourner les données si la requête est réussie
            return response.data;
        }
    } catch (error) {
        // Gérer les erreurs
        console.log("Erreur lors de la récupération des paiements :", error);
    }
};

export const getPaymentsByYear = async (teacherId: string) => {
    try {
        const response = await apiClient.get(`/payments/teacher/${teacherId}/yearly`);
        return response.data; // Les données des paiements par année
    } catch (error) {
        console.error("Error fetching payments:", error);
        throw error;
    }
};


