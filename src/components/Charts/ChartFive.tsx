"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Chargement dynamique du composant ReactApexChart sans SSR
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Options du graphique
const options: ApexOptions = {
  chart: {
    type: "line",
    height: 350,
    zoom: { enabled: true },
  },
  xaxis: { type: "datetime" },
  title: { text: "Inscriptions des étudiants au fil du temps", align: "left" },
  stroke: { width: 2 },
  markers: {
    size: 5,
    colors: ["#FF5733"],
    strokeWidth: 2,
  },
  tooltip: { x: { format: "dd MMM yyyy" } },
};

const ChartFive: React.FC = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const user = useSelector((state: RootState) => state.user);

  // Fonction pour filtrer les inscriptions selon la période sélectionnée
  const filterData = useCallback(
    (enrolments: any[]) => {
      const currentDate = new Date();
      return enrolments.filter((enrolment) => {
        const enrolmentDate = new Date(enrolment.createdAt);
        switch (filter) {
          case "lastWeek":
            return enrolmentDate >= new Date(currentDate.setDate(currentDate.getDate() - 7));
          case "lastMonth":
            return enrolmentDate >= new Date(currentDate.setMonth(currentDate.getMonth() - 1));
          default:
            return true;
        }
      });
    },
    [filter]
  );

  // Fonction pour structurer les données pour le graphique
  const prepareDataForChart = (enrolments: any[]) => {
    const data = enrolments.map((enrolment) => ({
      x: new Date(enrolment.createdAt).getTime(),
      y: 1,
    }));

    const groupedData = data.reduce((acc, entry) => {
      const dateKey = new Date(entry.x).toDateString();
      const existing = acc.find((group) => new Date(group.x).toDateString() === dateKey);
      if (existing) existing.y += 1;
      else acc.push(entry);
      return acc;
    }, [] as any[]);

    setChartData(groupedData);
  };

  // Récupération des inscriptions et mise à jour du graphique
  useEffect(() => {
    const fetchEnrolments = async () => {
      try {
        const response = await axios.get("http://localhost:4444/api/enrollement");
        const filteredEnrolments = filterData(response.data);
        prepareDataForChart(filteredEnrolments);
      } catch (error) {
        console.error("Erreur lors de la récupération des inscriptions :", error);
      }
    };
    fetchEnrolments();
  }, [user.id, filter, filterData]);

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
