
"use client"
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { createJob } from "@/services/jobService";
import React, { useState } from "react";

const AddJobForm: React.FC = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createJob({ name, description });
            setName("");
            setDescription("");
            alert("Job ajoutée avec succès !");
        } catch (err: any) {
            setError(err.response?.data?.message || "Une erreur s'est produite");
        }
    };

    return (
        <DefaultLayout>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow-md space-y-4">
                <h2 className="text-xl font-bold">Ajouter un Job d'etude</h2>
                {error && <p className="text-red-500">{error}</p>}
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
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                >
                    Ajouter
                </button>
            </form>
        </DefaultLayout>
    );
};

export default AddJobForm;
