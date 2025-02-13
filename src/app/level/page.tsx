"use client";
import React, { useEffect, useState } from "react";
import CardDataStats from "@/components/CardDataStats";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import DataTableComponent from "@/components/Tables/DataTable";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { deleteStudylevel, getAllStudyLevels } from "@/services/studyLevelService";
import { StudyLevel } from "@/types/studyLevel";
import EditStudyLevelForm from "../forms/EditStudyLevelForm/page";
import { useRouter } from "next/router";

const StudyLevels: React.FC = () => {
  const [studyLevels, setStudyLevels] = useState<StudyLevel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalStudyLevels, setTotalStudyLevels] = useState<string>('');
  const router = useRouter();


  const fetchStudyLevels = async () => {
    try {
      const data = await getAllStudyLevels();
      setStudyLevels(data);
      setTotalStudyLevels(data.length);
    } catch (err: any) {
      setError("Erreur lors du chargement des niveaux d'étude. Veuillez réessayer plus tard.");
    }
  };

  // Charger les niveaux d'étude
  useEffect(() => {
    fetchStudyLevels();
  }, []);

  const handleEditClick = (id: string) => {
    router.push(`/forms/EditStudyLevelForm?page=${id}`);
  };


  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce level ?")) {
      try {
        await deleteStudylevel(id);
        setStudyLevels((prevLevels) => prevLevels.filter((level) => level._id !== id));
        alert("level supprimé avec succès.");
      } catch (error) {
        console.log("Erreur lors de la suppression :", error);
        alert("Erreur lors de la suppression du level.");
      }
    }
  };

  // Colonnes du tableau
  const columns = [
    {
      name: "Nom",
      selector: (row: StudyLevel) => row.name,
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Description",
      selector: (row: StudyLevel) => row.description || "Non spécifiée",
      sortable: true,
    },
    {
      name: "Date de création",
      selector: (row: StudyLevel) => new Date(row.createdAt).toLocaleDateString("fr-FR"),
      sortable: true,
      center: true,
    },
    {
      name: "Actions",
      cell: (row: StudyLevel) => (
        <div className="flex items-center space-x-3.5">
          <button className="hover:text-red" aria-label="Supprimer" onClick={() => { handleDelete(row._id) }}>
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

  return (
    <DefaultLayout>
      <>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          <CardDataStats title="Total des Niveaux d'Étude" total={totalStudyLevels}>
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
            title="Liste des Niveaux d'Étude"
            columns={columns}
            data={studyLevels || []}
            pagination
            highlightOnHover
            addButtonText="Ajouter un Niveau d'Étude"
            onAddButtonLink="/forms/AddStudyLevelForm"
          />
        </div>
      </>
    </DefaultLayout>
  );
};

export default StudyLevels;
