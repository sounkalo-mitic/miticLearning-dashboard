import axios from "axios";

const API_URL = "http://localhost:4444/api/users";

export interface User {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    email: string;
    role: "admin" | "student" | "teacher";
    dateOfBirth?: string;
    phone: string;
    address?: string;
    studyLevel?: string;
    status?: boolean;
}


export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}`);
        return response.data; // Retourne la réponse contenant les utilisateurs
    } catch (error: any) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        throw new Error(error.response?.data?.message || "Erreur de connexion au serveur");
    }
};

export const createUser = async (user: User) => {
    const response = await axios.post(`http://localhost:4444/api/register`, user);
    return response.data;
};

export const updateUser = async (id: string, user: any) => {
    const response = await axios.put(`${API_URL}/${id}`, user);
    return response.data;
};

export const getUser = async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const deleteUser = async (id: string) => {
    const response = await axios.patch(`${API_URL}/${id}/toggle-status`);
    return response.data;
};
