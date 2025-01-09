"use client";
import React, { useEffect, useState } from "react";
import CardDataStats from "@/components/CardDataStats";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import DataTableComponent from "@/components/Tables/DataTable";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getAllCategories } from "@/services/categoryService";
import { Category } from "@/types/category";
import EditCategoryForm from "../forms/EditCategoryForm/page";

const Categories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [totalCategories, setTotalCategories] = useState<string>('');
    const [editCategoryId, setEditCategoryId] = useState<string | null>(null);

    const fetchCategories = async () => {
        try {
            const data = await getAllCategories();
            setCategories(data);
            setTotalCategories(String(data.length));
        } catch (err: any) {
            setError("Erreur lors du chargement des catégories. Veuillez réessayer plus tard.");
        }
    };

    // Charger les catégories
    useEffect(() => {
        fetchCategories();
    }, []);

    const handleEditClick = (id: string) => {
        setEditCategoryId(id);
    };

    const handleEditSuccess = () => {
        setEditCategoryId(null);
        fetchCategories()
    };

    // Colonnes du tableau
    const columns = [
        {
            name: "Nom",
            selector: (row: Category) => row.name,
            sortable: true,
            minWidth: "200px",
        },
        {
            name: "Description",
            selector: (row: Category) => row.description || "Non spécifiée",
            sortable: true,
        },
        {
            name: "Date de création",
            selector: (row: Category) => new Date(row.createdAt).toLocaleDateString("fr-FR"),
            sortable: true,
            center: true,
        },
        {
            name: "Actions",
            cell: (row: Category) => (
                <div className="flex items-center space-x-3.5">
                    <button className="hover:text-red" aria-label="Supprimer">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button className="hover:text-primary" aria-label="Modifier" onClick={() => {handleEditClick(row._id)}}>
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            center: true,
        },
    ];

    return (
        <DefaultLayout>
            {
                !editCategoryId ? (<>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                        <CardDataStats title="Total des Catégories" total={totalCategories}>
                            <FontAwesomeIcon icon={faList} color="#29015D" />
                        </CardDataStats>
                    </div>

                    <div className="pt-5">
                        {error && (
                            <div className="mb-4 text-center text-red-500 bg-red-100 p-3 rounded-md">
                                {error}
                            </div>
                        )}
                        <DataTableComponent
                            title="Liste des Catégories"
                            columns={columns}
                            data={categories || []}
                            pagination
                            highlightOnHover
                            addButtonText="Ajouter une Catégorie"
                            onAddButtonLink="/forms/AddCategoryForm"
                        />
                    </div>
                </>) : (<EditCategoryForm categoryId={editCategoryId} onSuccess={handleEditSuccess} />)
            }
        </DefaultLayout>
    );
};

export default Categories;
