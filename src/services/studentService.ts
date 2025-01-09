import axios from 'axios';

// Définir l'URL de base de votre API
const API_URL = 'http://localhost:4444/api'; // Remplacez par l'URL réelle de votre API

// Fonction pour récupérer les étudiants inscrits aux cours d'un professeur
export const getStudentsByTeacher = async (teacherId?: string) => {
    try {
        if (teacherId) {
            // Effectuer la requête GET pour récupérer les étudiants par l'ID de l'enseignant
            const response = await axios.get(`${API_URL}/students-by-teacher/${teacherId}`);
            // Si la requête réussit, renvoyer les données
            return response.data;
        } else {
            // Effectuer la requête GET pour récupérer tous les etudiants
        const response = await axios.get(`${API_URL}/enrollement`);
        // Si la requête réussit, renvoyer les données
        return response.data;

        }
    } catch (error) {
        // Si une erreur survient, afficher un message d'erreur
        console.error("Erreur lors de la récupération des étudiants :", error);
    }
};
