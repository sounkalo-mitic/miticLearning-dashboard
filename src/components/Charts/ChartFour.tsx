"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  chart: {
    type: "pie",
    height: 350,
  },
  labels: ["Completed", "In Progress"],
  colors: ["#3C50E0", "#80CAEE"],
  legend: {
    position: "top",
    horizontalAlign: "center",
  },
};

const ChartFour: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const [completionRate, setCompletionRate] = useState([0, 0]); // Completed, In Progress
  const [filter, setFilter] = useState<string>("all"); // Filtre initial (tous)

  // Fonction pour récupérer les inscriptions et calculer les stats
  const fetchEnrolments = useCallback(async () => {
    if (!user?.id) return; // Vérification pour éviter les requêtes inutiles
    try {
      const response = await axios.get(
        `http://localhost:4444/api/enrolment/teacher/${user.id}`
      );
      const data = response.data.enrolments;

      // Appliquer le filtre
      const filteredData =
        filter === "completed"
          ? data.filter((enrolment: any) => enrolment.status === "completed")
          : filter === "inProgress"
            ? data.filter((enrolment: any) => enrolment.status === "inProgress")
            : data;

      // Calcul du taux de complétion
      const total = filteredData.length;
      const completed = filteredData.filter(
        (enrolment: any) => enrolment.status === "completed"
      ).length;
      const inProgress = total - completed;

      setCompletionRate([completed, inProgress]);
    } catch (error) {
      console.error("Erreur lors de la récupération des inscriptions :", error);
    }
  }, [user?.id, filter]);

  useEffect(() => {
    fetchEnrolments();
  }, [fetchEnrolments]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex min-w-47.5">
          <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
            <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
          </span>
          <div className="w-full">
            <p className="font-semibold text-primary">Taux de Complétion des Formations</p>
            <p className="text-sm font-medium">Tous les cours du professeur</p>
          </div>
        </div>
      </div>

      {/* Zone de filtrage */}
      <div className="mb-4">
        <label htmlFor="statusFilter" className="mr-2 text-sm font-medium">Filtrer par statut:</label>
        <select
          id="statusFilter"
          className="border border-gray-300 p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Tous</option>
          <option value="completed">Complétés</option>
          <option value="inProgress">En Cours</option>
        </select>
      </div>

      <div>
        <div id="completionChart" className="-ml-5">
          <ReactApexChart
            options={options}
            series={completionRate}
            type="pie"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartFour;
