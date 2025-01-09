"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getProfessorAvis } from "@/services/avisService";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { RootState } from "@/redux/store";
import AvisItem from "@/components/AvisItem/page";

const Avis = () => {
    const [avis, setAvis] = useState<any[]>([]);
    const user = useSelector((state: RootState) => state.user);

    const fetchAvis = async () => {
        const userId = user.role === "teacher" ? (user.id ? String(user.id) : undefined) : undefined;
        const data = await getProfessorAvis(userId);
        setAvis(data.avis);
    };

    const handleAvisDeleted = (id: string) => {
        setAvis((prevAvis) => prevAvis.filter((item) => item._id !== id));
    };

    useEffect(() => {
        fetchAvis();
    }, [user?.id]);

    return (
        <DefaultLayout>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-6">Tableau de bord - Avis</h1>
                <div className="space-y-6">
                    {avis && avis.length > 0 ? (
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
                        <h2 className="text-2xl font-bold mb-6">Vous n'avez reçu aucun commentaire sur vos cours</h2>
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Avis;
