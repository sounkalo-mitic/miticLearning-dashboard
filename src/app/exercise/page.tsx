"use client"
import React from 'react';
import CardDataStats from '@/components/CardDataStats';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faList, faMoneyBill, faTrash, faUsers, faUsersCog } from '@fortawesome/free-solid-svg-icons';
import DataTableComponent from '@/components/Tables/DataTable';
import DefaultLayout from '../../components/Layouts/DefaultLayout';

const Exercise: React.FC = () => {

    // Exemple de données des exercices
    const exerciseData = [
        {
            id: 1,
            exerciseTitle: 'React Basics Quiz',
            studentName: 'Alice Dupont',
            course: 'Introduction to React',
            grade: 85,
            status: 'Submitted',
            submissionDate: '2024-12-20',
        },
        {
            id: 2,
            exerciseTitle: 'JavaScript Advanced Coding',
            studentName: 'Pierre Martin',
            course: 'Advanced JavaScript',
            grade: 90,
            status: 'Pending',
            submissionDate: '2024-12-18',
        },
        {
            id: 3,
            exerciseTitle: 'UI Wireframe Assignment',
            studentName: 'Sophie Lefevre',
            course: 'UI/UX Design Fundamentals',
            grade: 75,
            status: 'Reviewed',
            submissionDate: '2024-12-22',
        },
    ];

    // Colonnes du tableau
    const columns = [
        {
            name: 'Exercise Title',
            selector: (row: typeof exerciseData[0]) => row.exerciseTitle,
            sortable: true,
            minWidth: '200px',
        },
        {
            name: 'Student Name',
            selector: (row: typeof exerciseData[0]) => row.studentName,
            sortable: true,
        },
        {
            name: 'Course',
            selector: (row: typeof exerciseData[0]) => row.course,
            sortable: true,
        },
        {
            name: 'Grade',
            selector: (row: typeof exerciseData[0]) => `${row.grade}%`,
            sortable: true,
            center: true,
        },
        {
            name: 'Status',
            selector: (row: typeof exerciseData[0]) => row.status,
            sortable: true,
            center: true,
            cell: (row: typeof exerciseData[0]) => (
                <span
                    className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${row.status === 'Reviewed'
                            ? 'bg-success text-white'
                            : row.status === 'Pending'
                                ? 'bg-warning text-white'
                                : 'bg-info text-white'
                        }`}
                >
                    {row.status}
                </span>
            ),
        },
        {
            name: 'Submission Date',
            selector: (row: typeof exerciseData[0]) => row.submissionDate,
            sortable: true,
            center: true,
        },
        {
            name: 'Actions',
            cell: (row: typeof exerciseData[0]) => (
                <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary">
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button className="hover:text-red">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button className="hover:text-primary">
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
                <CardDataStats title="total de cours" total="50" rate="0.43%" levelUp>
                    <FontAwesomeIcon icon={faList} color='blue' />
                </CardDataStats>
                <CardDataStats title="Montant Total" total="FCFA 45,2K" rate="4.35%" levelUp>
                    <FontAwesomeIcon icon={faMoneyBill} color='blue' />
                </CardDataStats>

                <CardDataStats title="Total Inscrit" total="150" rate="0.95%" levelDown>
                    <FontAwesomeIcon icon={faUsers} color='blue' />
                </CardDataStats>
            </div>

            <div className="pt-5">
                <DataTableComponent
                    title="Listes des resultats d'exercice"
                    columns={columns}
                    data={exerciseData}
                    pagination
                    highlightOnHover
                />
            </div>
        </DefaultLayout>
    );
};

export default Exercise;
