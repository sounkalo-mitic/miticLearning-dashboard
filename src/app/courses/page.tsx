"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faEdit,
    faEye,
    faList,
    faMoneyBill,
    faTrash,
    faUsers,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import DataTableComponent from "@/components/Tables/DataTable";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { deleteCourse, getCourses } from "@/services/courseService";
import CardDataStats from "@/components/CardDataStats";
import { Course } from "@/types/course";
import PreviewCourse from "../ajout_cours/cours_validation/page";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";


const Courses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [totalCourse, setTotalCourse] = useState<string>('');
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const user = useSelector((state: RootState) => state.user); // Accès à l'utilisateur depuis Redux


    const fetchCourses = async () => {
        try {
            // Vérifiez si le rôle de l'utilisateur est "teacher"
            const userId = user.role === "teacher" ? (user.id ? String(user.id) : undefined) : undefined;

            // Appelez getCourses avec ou sans userId selon le rôle
            const data = await getCourses(userId);

            // Vérifiez si les données reçues sont valides
            if (Array.isArray(data.data)) {
                setCourses(data.data);
                setTotalCourse(data.data.length);
            } else {
                console.error("Les données reçues ne sont pas valides :", data);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des cours :", error);
        }
    };

    //calculer le total des montant des cours
    const calculateTotalPrice = (courses: any[]): number => {
        return courses.reduce((total, course) => total + (course.price || 0), 0);
    };

    // Charger les cours depuis l'API
    useEffect(() => {
        fetchCourses();
    }, []);

    // Actions
    const handleView = (id: string) => {
        setSelectedCourse(id)
    };

    const handleEdit = (id: string) => {
        alert(`Modifier le cours avec l'ID : ${id}`);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
            try {
                await deleteCourse(id);
                setCourses((prevCourses) => prevCourses.filter((course) => course._id !== id));
                alert("Cours supprimé avec succès.");
            } catch (error) {
                console.error("Erreur lors de la suppression :", error);
                alert("Erreur lors de la suppression du cours.");
            }
        }
    };

    // Colonnes pour DataTable
    const columns = [
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
            selector: (row: Course) => `${row.category_id ? row.category_id.name : "non definie"}`,
            sortable: true,
            center: true,
        },
        {
            name: "Certification",
            selector: (row: Course) => (
                <span
                    className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${row.isCertified ? "bg-success text-white" : "bg-danger text-white"
                        }`}
                >
                    {row.isCertified ? (
                        <FontAwesomeIcon icon={faCheck} />
                    ) : (
                        <FontAwesomeIcon icon={faXmark} />
                    )}
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
            selector: (row: Course) => (
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
            {
                !selectedCourse ? (
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
                ) : (<PreviewCourse courseId={selectedCourse} />)
            }
        </DefaultLayout>
    );
};

export default Courses;
