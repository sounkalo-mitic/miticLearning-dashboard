"use client";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { getProfessorAvis } from "@/services/avisService";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { RootState } from "@/redux/store";
import AvisItem from "@/components/AvisItem/page";

// Définition d'un type pour les avis
interface AvisType {
    _id: string;
    content: string;
    author: string;
    createdAt: string;
}

// Composant principal
const Avis = () => {
    // État pour stocker les avis et gérer le chargement
    const [avis, setAvis] = useState<AvisType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Récupération des informations utilisateur depuis Redux
    const user = useSelector((state: RootState) => state.user);

    // Fonction pour récupérer les avis
    const fetchAvis = useCallback(async () => {
        try {
            setLoading(true); // Indique que les données sont en cours de chargement
            const userId = user.role === "teacher" ? (user.id ? String(user.id) : undefined) : undefined;
            const data = await getProfessorAvis(userId);
            setAvis(data.avis);
        } catch (error) {
            console.error("Erreur lors de la récupération des avis :", error);
        } finally {
            setLoading(false); // Fin du chargement
        }
    }, [user.id, user.role]);

    // Fonction pour supprimer un avis de la liste après suppression
    const handleAvisDeleted = (id: string) => {
        setAvis((prevAvis) => prevAvis.filter((item) => item._id !== id));
    };

    // Exécute fetchAvis lorsque l'ID de l'utilisateur change
    useEffect(() => {
        fetchAvis();
    }, [fetchAvis]);

    return (
        <DefaultLayout>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-6">Tableau de bord - Avis</h1>

                {/* Affichage d'un message de chargement si les données sont en cours de récupération */}
                {loading ? (
                    <p className="text-gray-500">Chargement des avis...</p>
                ) : (
                    <div className="space-y-6">
                        {avis.length > 0 ? (
                            avis.map((item) => (
                                <AvisItem
                                    key={item._id}
                                    item={item}
                                    user={user}
                                    onAvisDeleted={handleAvisDeleted}
                                    canRespond={true}
                                />
                            ))
                        ) : (
                            <h2 className="text-2xl font-bold mb-6">
                                {"Vous n'avez reçu aucun commentaire sur vos cours"}
                            </h2>
                        )}
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default Avis;
