import { CourseResponse } from "@/types/course";
import axios from "axios";

// Définir l'URL de base pour les API des cours
const BASE_URL = "http://localhost:4444/api/course";

// Récupérer tous les cours
export const getCourses = async (userId? : String): Promise<any> => {
    try {
        if (!userId) {
            const response = await axios.get(BASE_URL);
            return response.data;
        } else {
            const response = await axios.get(`${BASE_URL}/teacher/${userId}`);
            return response.data;
        }
        
    } catch (error) {
        console.error("Erreur lors de la récupération des cours :", error);
        throw error;
    }
};

// Créer un cours
export const createCourse = async (courseData: FormData): Promise<any> => {
    try {
        const response = await axios.post(BASE_URL, courseData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création du cours :", error);
        throw error;
    }
};

// Mettre à jour un cours
export const updateCourse = async (id: string, courseData: Partial<any>): Promise<any> => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, courseData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du cours :", error);
        throw error;
    }
};

// Supprimer un cours
export const deleteCourse = async (id: string): Promise<any> => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression du cours :", error);
        throw error;
    }
};

// Obtenir un cours par ID
export const getCourseById = async (id: string): Promise<any> => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du cours :", error);
        throw error;
    }
};

export const getCourseEnrollmentStats = async (userId?: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/enrollments/${userId}`);
        return response.data; // Données retournées par l'API
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques des inscriptions :', error);
        throw new Error('Impossible de récupérer les données des inscriptions.');
    }
};

export const getCourseDetails = async (courseId: string): Promise<CourseResponse> => {
    try {
        const response = await axios.get<CourseResponse>(`${BASE_URL}/getCourseAllInfo/${courseId}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des détails du cours :", error);
        throw error;
    }
};