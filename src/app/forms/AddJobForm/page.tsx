"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { createJob } from "@/services/jobService";
import React, { useState } from "react";

const AddJobForm: React.FC = () => {
    // États pour stocker les valeurs du formulaire et gérer les erreurs et le chargement
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // Fonction de soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Empêche le rechargement de la page

        // Vérification de l'état de chargement pour éviter plusieurs soumissions
        if (loading) return;

        setLoading(true); // Mise à jour de l'état pour indiquer que la requête est en cours
        setError(""); // Réinitialisation de l'erreur avant de soumettre

        try {
            // Envoi de la requête pour créer un job
            await createJob({ name, description });
            setName(""); // Réinitialiser le champ "nom"
            setDescription(""); // Réinitialiser le champ "description"
            alert("Job ajouté avec succès !"); // Confirmation à l'utilisateur
        } catch (err: any) {
            // Gestion des erreurs : affichage du message d'erreur
            setError(err.response?.data?.message || "Une erreur s'est produite");
        } finally {
            setLoading(false); // Remise à jour de l'état une fois la requête terminée
        }
    };

    return (
        <DefaultLayout>
            <form
                onSubmit={handleSubmit}
                className="max-w-lg mx-auto bg-white p-6 rounded shadow-md space-y-4"
            >
                {/* Titre du formulaire */}
                <h2 className="text-xl font-bold">Ajouter un Job d&apos;étude</h2>
                {/* Affichage des erreurs si présentes */}
                {error && <p className="text-red-500">{error}</p>}

                {/* Champ "Nom" */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                {/* Champ "Description" */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>

                {/* Bouton de soumission */}
                <button
                    type="submit"
                    disabled={loading} // Désactive le bouton pendant le chargement
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                >
                    {loading ? "Ajout en cours..." : "Ajouter"} {/* Affichage dynamique en fonction du statut de chargement */}
                </button>
            </form>
        </DefaultLayout>
    );
};

export default AddJobForm;
