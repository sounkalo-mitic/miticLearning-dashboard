"use client";
import React, { useEffect, useState } from "react";
import CardDataStats from "@/components/CardDataStats";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import DataTableComponent from "@/components/Tables/DataTable";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { deleteJob, getAllJobs } from "@/services/jobService";
import { Job } from "@/types/job";
import { useRouter } from "next/router";


const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalJobs, setTotalJobs] = useState<string>('');
  const router = useRouter();

  const fetchJobs = async () => {
    try {
      const data = await getAllJobs();
      setJobs(data);
      setTotalJobs(data.length);
    } catch (err: any) {
      setError("Erreur lors du chargement des emplois. Veuillez réessayer plus tard.");
    }
  };
  // Charger les emplois
  useEffect(() => {
    fetchJobs();
  }, []);

  const handleEditClick = (id: string) => {
    router.push(`/forms/EditJobForm?page=${id}`);
  };


  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce job ?")) {
      try {
        await deleteJob(id);
        setJobs((jobs) => jobs.filter((job) => job._id !== id));
        alert("job supprimé avec succès.");
      } catch (error) {
        console.log("Erreur lors de la suppression :", error);
        alert("Erreur lors de la suppression du job.");
      }
    }
  };

  // Colonnes du tableau
  const columns = [
    {
      name: "Nom",
      selector: (row: Job) => row.name,
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Description",
      selector: (row: Job) => row.description || "Non spécifiée",
      sortable: true,
    },
    {
      name: "Date de création",
      selector: (row: Job) => new Date(row.createdAt).toLocaleDateString("fr-FR"),
      sortable: true,
      center: true,
    },
    {
      name: "Actions",
      cell: (row: Job) => (
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
          <CardDataStats title="Total des Emplois" total={totalJobs}>
            <FontAwesomeIcon icon={faBriefcase} color="#29015D" />
          </CardDataStats>
        </div>

        <div className="pt-5">
          {error && (
            <div className="mb-4 text-center text-red-500 bg-red-100 p-3 rounded-md">
              {error}
            </div>
          )}
          <DataTableComponent
            title="Liste des Emplois"
            columns={columns}
            data={jobs}
            pagination
            highlightOnHover
            addButtonText="Ajouter un Emploi"
            onAddButtonLink="/forms/AddJobForm"
          />
        </div>
      </>
    </DefaultLayout>
  );
};

export default Jobs;
