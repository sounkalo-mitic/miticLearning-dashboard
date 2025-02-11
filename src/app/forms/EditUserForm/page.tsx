"use client"
import { getAllStudyLevels } from "@/services/studyLevelService";
import { getUser, updateUser, User } from "@/services/userService";
import { useEffect, useState } from "react";

interface StudyLevel {
    _id: string;
    name: string;
}

interface EditUserFormProps {
    userId: string;
    onUpdateSuccess: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ userId, onUpdateSuccess }) => {
    const [studyLevels, setStudyLevels] = useState<StudyLevel[]>([]);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        role: "",
        dateOfBirth: "",
        phone: "",
        address: "",
        studyLevel: "",
        status: true,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const levels = await getAllStudyLevels();
                setStudyLevels(levels);

                const user = await getUser(userId);
                setFormData({
                    firstname: user.firstname,
                    lastname: user.lastname,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().slice(0, 10) : "",
                    phone: user.phone,
                    address: user.address || "",
                    studyLevel: user.studyLevel.name || "",
                    status: user.status,
                });
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };
        fetchData();
    }, [userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUser(userId, formData as User);
            alert("Utilisateur mis à jour avec succès !");
            onUpdateSuccess();
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
            alert("Une erreur s'est produite.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded-md space-y-4">
            <div>
                <label className="block text-gray-700">Prénom</label>
                <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div>
                <label className="block text-gray-700">Nom</label>
                <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div>
                <label className="block text-gray-700">Nom d'utilisateur</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div>
                <label className="block text-gray-700">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div>
                <label className="block text-gray-700">Rôle</label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="">Sélectionnez un rôle</option>
                    <option value="admin">Admin</option>
                    <option value="student">Étudiant</option>
                    <option value="teacher">Enseignant</option>
                </select>
            </div>
            <div>
                <label className="block text-gray-700">Téléphone</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div>
                <label className="block text-gray-700">Adresse</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div>
                <label className="block text-gray-700">Niveau d'étude</label>
                <select
                    name="studyLevel"
                    value={formData.studyLevel}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="">Sélectionnez un niveau</option>
                    {studyLevels.map((level) => (
                        <option key={level._id} value={level._id}>
                            {level.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-gray-700">Date de naissance</label>
                <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"

                />
            </div>
            <div>
                <label className="block text-gray-700">Statut</label>
                <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={() => setFormData((prev) => ({ ...prev, status: !prev.status }))}
                    className="mr-2"
                />
                <span>{formData.status ? "Actif" : "Inactif"}</span>
            </div>
            <button
                type="submit"
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={loading}
            >
                {loading ? "Chargement..." : "Modifier"}
            </button>
        </form>
    );
};

export default EditUserForm;
