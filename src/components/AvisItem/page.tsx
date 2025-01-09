import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faTrashAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { getResponsesByAvis, deleteAvis, createResponse } from "@/services/avisService";

const AvisItem = ({ item, user, onAvisDeleted, canRespond }: { item: any; user: any; onAvisDeleted: (id: string) => void; canRespond: boolean }) => {
    const [expanded, setExpanded] = useState(false);
    const [responses, setResponses] = useState<any[]>([]);
    const [newResponse, setNewResponse] = useState<string>("");

    const handleViewResponses = async () => {
        if (expanded) {
            setExpanded(false);
            setResponses([]);
        } else {
            const data = await getResponsesByAvis(item._id);
            setResponses(data.replies);
            setExpanded(true);
        }
    };

    const handleDeleteAvis = async () => {
        if (confirm("Voulez-vous vraiment supprimer cet avis ?")) {
            await deleteAvis(item._id);
            onAvisDeleted(item._id); // Informer le parent que l'avis a été supprimé
        }
    };

    const handleResponseSubmit = async () => {
        if (!newResponse) return;

        await createResponse(item._id, newResponse, user.id);
        setNewResponse("");
        handleViewResponses(); // Recharger les réponses après soumission
    };

    return (
        <div className="p-4 border rounded-lg shadow-md bg-white">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FontAwesomeIcon icon={faUser} />
                <span>{item.user_id.username}</span>
            </div>
            <h2 className="text-lg font-semibold">{item.content}</h2>
            <p className="text-gray-600">cours : {item.item_id.title}</p>
            <button
                onClick={handleViewResponses}
                className="mt-2 text-blue-500 hover:underline flex items-center"
            >
                <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
                {expanded ? "Masquer les réponses" : "Voir les réponses"}
            </button>

            {user.role === "admin" && (
                <button
                    onClick={handleDeleteAvis}
                    className="ml-4 text-red-500 hover:underline flex items-center"
                >
                    <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                    Supprimer
                </button>
            )}

            {expanded && (
                <div className="mt-4 space-y-2">
                    <h3 className="font-semibold">Réponses :</h3>
                    {responses?.length > 0 ? (
                        responses?.map((response) => (
                            <div key={response._id} className="p-2 border rounded bg-gray-100">
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <FontAwesomeIcon icon={faUser} />
                                    <span>{response.user_id.username}</span>
                                </div>
                                <p>{response.content}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Aucune réponse pour cet avis.</p>
                    )}
                    {canRespond && (
                        <div className="mt-4">
                            <textarea
                                className="w-full p-2 border rounded"
                                rows={3}
                                value={newResponse}
                                onChange={(e) => setNewResponse(e.target.value)}
                                placeholder="Écrire une réponse..."
                            ></textarea>
                            <button
                                onClick={handleResponseSubmit}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Répondre
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AvisItem;
