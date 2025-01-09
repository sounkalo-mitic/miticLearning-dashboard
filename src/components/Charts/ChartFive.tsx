"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  chart: {
    type: "line",
    height: 350,
    zoom: {
      enabled: true,
    },
  },
  xaxis: {
    type: "datetime",
  },
  title: {
    text: "Inscriptions des étudiants au fil du temps",
    align: "left",
  },
  stroke: {
    width: 2,
  },
  markers: {
    size: 5,
    colors: ["#FF5733"],
    strokeColor: "#fff",
    strokeWidth: 2,
  },
  tooltip: {
    x: {
      format: "dd MMM yyyy",
    },
  },
};

const ChartFive: React.FC = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const user = useSelector((state: RootState) => state.user);

  // Fonction pour transformer la date d'inscription en format requis pour le graphique
  const prepareDataForChart = (enrolments: any[]) => {
    const data = enrolments.map((enrolment) => ({
      x: new Date(enrolment.createdAt).getTime(),
      y: 1, // Une inscription par ligne
    }));

    // Grouper les données par date
    const groupedData: any[] = [];
    data.forEach((entry) => {
      const existing = groupedData.find(
        (group) => new Date(group.x).toDateString() === new Date(entry.x).toDateString()
      );
      if (existing) {
        existing.y += 1;
      } else {
        groupedData.push(entry);
      }
    });

    // Mise à jour de l'état pour le graphique
    setChartData(groupedData);
  };

  // Fonction de filtrage des données en fonction de la sélection
  const filterData = (enrolments: any[]) => {
    const filteredData = enrolments.filter((enrolment) => {
      const enrolmentDate = new Date(enrolment.createdAt);
      const currentDate = new Date();

      if (filter === "lastWeek") {
        const lastWeek = new Date();
        lastWeek.setDate(currentDate.getDate() - 7);
        return enrolmentDate >= lastWeek;
      } else if (filter === "lastMonth") {
        const lastMonth = new Date();
        lastMonth.setMonth(currentDate.getMonth() - 1);
        return enrolmentDate >= lastMonth;
      }
      // Si aucun filtre n'est sélectionné, afficher toutes les données
      return true;
    });

    return filteredData;
  };

  useEffect(() => {
    const fetchEnrolments = async () => {
      try {
        const response = await axios.get(`http://localhost:4444/api/enrollement`);
        const enrolments = response.data;

        // Appliquer le filtre
        const filteredEnrolments = filterData(enrolments);

        // Préparer les données pour le graphique
        prepareDataForChart(filteredEnrolments);
      } catch (error) {
        console.error("Erreur lors de la récupération des inscriptions :", error);
      }
    };

    fetchEnrolments();
  }, [user.id, filter]); // Recharger les données à chaque changement de filtre

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex min-w-47.5">
          <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
            <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
          </span>
          <div className="w-full">
            <p className="font-semibold text-primary">Inscriptions des Étudiants</p>
            <p className="text-sm font-medium">Au fil du temps (par jour)</p>
          </div>
        </div>
      </div>

      {/* Zone de filtrage */}
      <div className="mb-4">
        <label className="mr-2">Filtrer par :</label>
        <select
          className="border p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Toutes les inscriptions</option>
          <option value="lastWeek">Cette semaine</option>
          <option value="lastMonth">Ce mois</option>
        </select>
      </div>

      <div>
        <div id="enrolmentChart" className="-ml-5">
          <ReactApexChart
            options={options}
            series={[{ name: "Inscriptions", data: chartData }]}
            type="line"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartFive;
