"use client";
import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faEdit,
    faEye,
    faList,
    faMoneyBill,
    faTrash,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import DataTableComponent from "@/components/Tables/DataTable";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { deleteCourse, getCourses } from "@/services/courseService";
import CardDataStats from "@/components/CardDataStats";
import { Course } from "@/types/course";
import PreviewCourse from "../cours_validation/page";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { TableColumn } from "react-data-table-component";

const Courses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [totalCourse, setTotalCourse] = useState<string>('');
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const user = useSelector((state: RootState) => state.user);

    /**
     * Récupère la liste des cours depuis l'API en fonction du rôle de l'utilisateur.
     */
    const fetchCourses = useCallback(async () => {
        try {
            // Déterminer si l'utilisateur est un enseignant et récupérer son ID
            const userId = user.role === "teacher" ? String(user.id || "") : undefined;

            // Récupérer les cours via l'API
            const data = await getCourses(userId);

            if (Array.isArray(data.data)) {
                setCourses(data.data);
                setTotalCourse(String(data.data.length));
            } else {
                console.error("Réponse API inattendue :", data);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des cours :", error);
        }
    }, [user.id, user.role]);

    /**
     * Calcule le montant total des cours.
     */
    const calculateTotalPrice = (courses: Course[]): number => {
        return courses.reduce((total, course) => total + (course.price || 0), 0);
    };

    /**
     * Charge les cours au montage du composant et lors du changement de l'utilisateur.
     */
    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    /**
     * Gère l'affichage du détail d'un cours.
     */
    const handleView = (id: string) => {
        setSelectedCourse(id);
    };

    /**
     * Gère la modification d'un cours.
     */
    const handleEdit = (id: string) => {
        alert(`Modifier le cours avec l'ID : ${id}`);
    };

    /**
     * Gère la suppression d'un cours avec confirmation.
     */
    const handleDelete = async (id: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
            try {
                await deleteCourse(id);
                setCourses((prevCourses) => prevCourses.filter((course) => course._id !== id));
                alert("Cours supprimé avec succès.");
            } catch (error) {
                console.error("Erreur lors de la suppression :", error);
                alert("Une erreur s'est produite. Veuillez réessayer.");
            }
        }
    };

    // Définition des colonnes du tableau
    const columns: TableColumn<Course>[] = [
        {
            name: "Titre",
            selector: (row: Course) => row.title,
            sortable: true,
        },
        {
            name: "Durée",
            selector: (row: Course) => row.duration,
            sortable: true,
            center: true,
        },
        {
            name: "Enseignant",
            selector: (row: Course) => `${row.created_by.firstname} ${row.created_by.lastname}`,
            sortable: true,
            center: true,
        },
        {
            name: "Catégorie",
            selector: (row: Course) => row.category_id ? row.category_id.name : "Non définie",
            sortable: true,
            center: true,
        },
        {
            name: "Certification",
            cell: (row: Course) => (
                <span
                    className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${row.isCertified ? "bg-success text-white" : "bg-danger text-white"
                        }`}
                >
                    <FontAwesomeIcon icon={row.isCertified ? faCheck : faXmark} />
                </span>
            ),
            sortable: true,
            center: true,
        },
        {
            name: "Prix",
            selector: (row: Course) => `FCFA ${row.price.toLocaleString()}`,
            sortable: true,
            center: true,
        },
        {
            name: "Statut",
            cell: (row: Course) => (
                <span
                    className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${row.status ? "bg-success text-white" : "bg-danger text-white"
                        }`}
                >
                    {row.status ? "Actif" : "Inactif"}
                </span>
            ),
            sortable: true,
            center: true,
        },
        {
            name: "Date de création",
            selector: (row: Course) => new Date(row.createdAt).toLocaleDateString("fr-FR"),
            sortable: true,
            center: true,
        },
        {
            name: "Actions",
            cell: (row: Course) => (
                <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary" onClick={() => handleView(row._id)}>
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button className="hover:text-primary" onClick={() => handleEdit(row._id)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="hover:text-red" onClick={() => handleDelete(row._id)}>
                        <FontAwesomeIcon icon={faTrash} />
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
            {selectedCourse !== null ? (
                <>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                        <CardDataStats title="Total de cours" total={totalCourse}>
                            <FontAwesomeIcon icon={faList} color="#29015D" />
                        </CardDataStats>
                        <CardDataStats title="Montant Total" total={String(calculateTotalPrice(courses))}>
                            <FontAwesomeIcon icon={faMoneyBill} color="#29015D" />
                        </CardDataStats>
                    </div>
                    <div className="pt-5">
                        <DataTableComponent
                            title="Liste des Cours"
                            columns={columns}
                            data={courses}
                            pagination
                            highlightOnHover
                            addButtonText="Ajouter un cours"
                            onAddButtonLink="/forms/AddCourseForm"
                        />
                    </div>
                </>
            ) : (
                <PreviewCourse courseId={String(selectedCourse)} />
            )}

        </DefaultLayout>
    );
};

export default Courses;
