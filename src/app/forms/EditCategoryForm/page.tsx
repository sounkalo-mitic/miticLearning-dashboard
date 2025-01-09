import { getCategoryById, updateCategory } from "@/services/categoryService";
import React, { useEffect, useState } from "react";

interface EditCategoryFormProps {
  categoryId: string;
  onSuccess: () => void; // Callback pour rafraîchir la liste des catégories après mise à jour
}

const EditCategoryForm: React.FC<EditCategoryFormProps> = ({ categoryId, onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await getCategoryById(categoryId);
        setName(data.name);
        setDescription(data.description || "");
      } catch (err: any) {
        setError(err.response?.data?.message || "Une erreur s'est produite");
      }
    };
    fetchCategory();
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCategory(categoryId, { name, description });
      alert("Catégorie mise à jour avec succès !");
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Une erreur s'est produite");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow-md space-y-4">
      <h2 className="text-xl font-bold">Modifier la catégorie</h2>
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
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
      >
        Modifier
      </button>
    </form>
  );
};

export default EditCategoryForm;
