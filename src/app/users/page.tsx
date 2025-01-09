"use client"
import React, { useEffect, useState } from 'react';
import CardDataStats from '@/components/CardDataStats';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faList, faTrash } from '@fortawesome/free-solid-svg-icons';
import DataTableComponent from '@/components/Tables/DataTable';
import DefaultLayout from '../../components/Layouts/DefaultLayout';
import { deleteUser, getAllUsers } from '@/services/userService';
import { User } from '@/types/user';
import EditUserForm from '../forms/EditUserForm/page';

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [totalUser, setTotalUser] = useState<string>('');
    const [editUserId, setEditUserId] = useState<string | null>(null);

    // Colonnes du tableau
    const columns = [
        {
            name: 'Name',
            selector: (row: User) => `${row.firstname} ${row.lastname}`,
            sortable: true,
            minWidth: '200px',
        },
        {
            name: 'Email',
            selector: (row: User) => `${row.email}`,
            sortable: true,
        },
        {
            name: 'Role',
            selector: (row: User) => `${row.role}`,
            sortable: true,
            center: true,
        },
        {
            name: 'telephone',
            selector: (row: User) => `${row.phone}`,
            sortable: true,
            center: true,
        },
        {
            name: 'Niveau',
            selector: (row: User) => row.studyLevel?.name || "Non spécifié",
            sortable: true,
            center: true,
        },
        {
            name: 'Status',
            selector: (row: User) => row.status,
            sortable: true,
            center: true,
            cell: (row: User) => (
                <span
                    className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${row.status
                        ? 'bg-success text-white'
                        : 'bg-danger text-white'
                        }`}
                >
                    {row.status ? "Actif" : "Inactif"}
                </span>
            ),
        },
        {
            name: 'Inscription Date',
            selector: (row: User) => new Date(row.createdAt).toLocaleDateString("fr-FR"),
            sortable: true,
            center: true,
        },
        {
            name: 'Actions',
            cell: (row: User) => (
                <div className="flex items-center space-x-3.5">
                    <button className="hover:text-red" aria-label="Supprimer" onClick={() => handleDelete(row._id)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button className="hover:text-primary" aria-label="Modifier" onClick={() => { handleEditClick(row._id) }}>
                        <FontAwesomeIcon icon={faEdit} />
                    </button>

                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            center: true,
        },
    ];

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data.data);
            setTotalUser(data.data.length);

        } catch (err: any) {
            setError(err.message);
        }
    };

    // Charger les étudiants
    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEditClick = (id: string) => {
        setEditUserId(id);
    };

    const handleEditSuccess = () => {
        setEditUserId(null);
        fetchUsers()
    };

    const handleDelete = async (id: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce utilisateur ?")) {
          try {
            await deleteUser(id);
            // setUsers((users) => users.filter((user) => user._id !== id));
            fetchUsers();
            alert("utilisateur supprimé avec succès.");
          } catch (error) {
            console.log("Erreur lors de la suppression :", error);
            alert("Erreur lors de la suppression du utilisateur.");
          }
        }
      };


    return (
        <DefaultLayout>
            {
                !editUserId ? (<>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                        <CardDataStats title="Total d'utilisateur" total={totalUser}>
                            <FontAwesomeIcon icon={faList} color='#29015D' />
                        </CardDataStats>
                    </div>

                    <div className="pt-5">
                        <DataTableComponent
                            title="Listes des utilisateurs"
                            columns={columns}
                            data={users}
                            pagination
                            highlightOnHover
                            addButtonText='Ajouter utilisateur'
                            onAddButtonLink='/forms/AddUserForm'
                        />
                    </div>
                </>) : (<EditUserForm userId={editUserId} onUpdateSuccess={handleEditSuccess} />)
            }
        </DefaultLayout>
    );
};

export default Users;
