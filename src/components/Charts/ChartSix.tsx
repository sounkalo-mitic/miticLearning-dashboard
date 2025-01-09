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
    type: "pie",
    height: 350,
  },
  labels: [],
  title: {
    text: "Répartition des rôles des utilisateurs",
    align: "center",
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: "100%",
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
};

const ChartSix: React.FC = () => {
  const [chartData, setChartData] = useState<number[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const user = useSelector((state: RootState) => state.user);

  // Fonction pour préparer les données du graphique
  const prepareRoleDataForChart = (users: any[]) => {
    const roleCounts: Record<string, number> = {};

    // Comptabiliser les utilisateurs par rôle
    users.forEach((user) => {
      const role = user.role;
      if (roleCounts[role]) {
        roleCounts[role] += 1;
      } else {
        roleCounts[role] = 1;
      }
    });

    // Mettre à jour les données pour le graphique
    setRoles(Object.keys(roleCounts));
    setChartData(Object.values(roleCounts));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:4444/api/users`);
        const users = response.data.data;
        console.log(users);
        
        prepareRoleDataForChart(users);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    };

    fetchUsers();
  }, [user.id]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex min-w-47.5">
          <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
            <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
          </span>
          <div className="w-full">
            <p className="font-semibold text-primary">Répartition des Rôles</p>
            <p className="text-sm font-medium">Par utilisateur</p>
          </div>
        </div>
      </div>

      <div>
        <div id="roleChart" className="-ml-5">
          <ReactApexChart
            options={{
              ...options,
              labels: roles,
            }}
            series={chartData}
            type="pie"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartSix;
