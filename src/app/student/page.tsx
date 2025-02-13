"use client";

import React, { useEffect, useState, useCallback } from "react";
import CardDataStats from "@/components/CardDataStats";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faList } from "@fortawesome/free-solid-svg-icons";
import DataTableComponent from "@/components/Tables/DataTable";
import DefaultLayout from "../../components/Layouts/DefaultLayout";
import { getStudentsByTeacher } from "@/services/studentService";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Student {
    student: {
        firstname: string;
        lastname: string;
        email: string;
        phone: string;
    };
    course: {
        title: string;
        duration: string;
    };
}

const Students: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [totalStudent, setTotalStudent] = useState<string>("");

    const user = useSelector((state: RootState) => state.user);

    const fetchStudents = useCallback(async () => {
        try {
            const userId = user.role === "teacher" ? String(user.id) : undefined;
            const data = await getStudentsByTeacher(userId);

            if (Array.isArray(data.students)) {
                setStudents(data.students);
                setTotalStudent(data.students.length.toString());
            } else {
                throw new Error("Les données reçues ne sont pas valides.");
            }
        } catch (err) {
            setError("Erreur lors du chargement des étudiants.");
            console.error("Erreur lors du chargement des étudiants :", err);
        }
    }, [user.id, user.role]);

    useEffect(() => {
        if (user?.id) {
            fetchStudents();
        }
    }, [fetchStudents, user?.id]);

    const handleEdit = (student: Student) => {
        alert(`Modifier l'étudiant : ${student.student.firstname} ${student.student.lastname}`);
    };

    const handleDelete = (student: Student) => {
        if (
            confirm(`Êtes-vous sûr de vouloir supprimer l'étudiant ${student.student.firstname} ${student.student.lastname} ?`)
        ) {
            setStudents((prev) => prev.filter((s) => s.student.email !== student.student.email));
            alert("Étudiant supprimé avec succès.");
        }
    };

    const columns = [
        {
            name: "Nom Étudiant",
            selector: (row: Student) => `${row.student.firstname} ${row.student.lastname}`,
            sortable: true,
            minWidth: "200px",
        },
        {
            name: "Email",
            selector: (row: Student) => row.student.email,
            sortable: true,
        },
        {
            name: "Numéro",
            selector: (row: Student) => row.student.phone,
            sortable: true,
            center: true,
        },
        {
            name: "Cours",
            selector: (row: Student) => row.course.title,
            sortable: true,
            center: true,
        },
        {
            name: "Durée",
            selector: (row: Student) => row.course.duration,
            sortable: true,
            center: true,
        },
        {
            name: "Actions",
            cell: (row: Student) => (
                <div className="flex items-center space-x-3.5">
                    <button className="hover:text-red" onClick={() => handleDelete(row)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button className="hover:text-primary" onClick={() => handleEdit(row)}>
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                <CardDataStats title="Total des étudiants" total={totalStudent}>
                    <FontAwesomeIcon icon={faList} color="#29015D" />
                </CardDataStats>
            </div>

            <div className="pt-5 min-w-203">
                {error ? (
                    <div className="text-red-500">Erreur : {error}</div>
                ) : (
                    <DataTableComponent title="Liste des étudiants" columns={columns} data={students} pagination highlightOnHover />
                )}
            </div>
        </DefaultLayout>
    );
};

export default Students;
