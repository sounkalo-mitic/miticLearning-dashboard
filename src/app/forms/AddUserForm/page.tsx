"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getAllStudyLevels } from "@/services/studyLevelService";
import { createUser, User } from "@/services/userService";
import { StudyLevel } from "@/types/studyLevel";
import { useEffect, useState } from "react";

const AddUserForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [studyLevels, setStudyLevels] = useState<StudyLevel[]>([]);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        password: "",
        email: "",
        role: "",
        dateOfBirth: "",
        phone: "",
        address: "",
        studyLevel: "",
    });

    useEffect(() => {
        const fetchStudyLevels = async () => {
            try {
                const levels = await getAllStudyLevels();
                setStudyLevels(levels);
            } catch (error) {
                console.error("Erreur lors de la récupération des StudyLevels :", error);
            }
        };
        fetchStudyLevels();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Filtrer les champs vides
        const filteredFormData = Object.entries(formData)
            .filter(([_, value]) => value.trim() !== "")
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

        try {
            await createUser(filteredFormData as User);
            alert("Utilisateur créé avec succès !");
            setFormData({
                firstname: "",
                lastname: "",
                username: "",
                password: "",
                email: "",
                role: "",
                dateOfBirth: "",
                phone: "",
                address: "",
                studyLevel: "",
            });
        } catch (error: any) {
            console.error(error.response?.data?.errors);
            setError(error.response?.data?.errors[0] || "Une erreur s'est produite");
        } finally {
            setLoading(false);
        }
    };


    return (
        <DefaultLayout>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow-md space-y-4">
                <h2 className="text-xl font-bold">Ajouter un utilisateur</h2>
                {error && <p className="text-red-500">{error}</p>}
                <div>
                    <label className="block text-gray-700">Prénom</label>
                    <input
                        type="text"
                        name="firstname"
                        value={formData.firstname || ""}
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
                        value={formData.lastname || ""}
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
                        value={formData.username || ""}
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
                        value={formData.email || ""}
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
                        value={formData.address || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"

                    />
                </div>
                <div>
                    <label className="block text-gray-700">Mot de passe</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Téléphone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Date de naissance</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth || ""}
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
                    <label className="block text-gray-700">Rôle</label>
                    <select
                        name="role"
                        value={formData.role || ""}
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
                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? "Chargement..." : "Ajouter"}
                </button>
            </form>
        </DefaultLayout>
    );
};

export default AddUserForm;
