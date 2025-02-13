"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Payment } from "@/types/payment";
import { getPaymentsByTeacher } from "@/services/paymentService";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Configuration du graphique ApexCharts
const options: ApexOptions = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: { show: false },
  },
  stroke: {
    width: [2, 2],
    curve: "straight",
  },
  grid: { xaxis: { lines: { show: true } }, yaxis: { lines: { show: true } } },
  dataLabels: { enabled: false },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#3056D3", "#80CAEE"],
    strokeWidth: 3,
    fillOpacity: 1,
  },
  xaxis: {
    type: "category",
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { min: 0 },
};

const ChartOne: React.FC = () => {
  const [series, setSeries] = useState([{ name: "Total Payments", data: Array(12).fill(0) }]);
  const [filter, setFilter] = useState("all"); // Par défaut "all"
  const user = useSelector((state: RootState) => state.user);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Fonction pour récupérer les paiements de l'utilisateur
  const fetchPayments = useCallback(async () => {
    try {
      if (user.role !== "teacher" || !user.id) return;
      const data = await getPaymentsByTeacher(String(user.id));
      if (Array.isArray(data.payments)) {
        setPayments(data.payments);
      } else {
        console.error("Format de données invalide:", data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des paiements:", error);
    }
  }, [user.id, user.role]);

  // Mise à jour des paiements lors du changement de l'utilisateur
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Formatage des paiements pour le graphique
  useEffect(() => {
    const monthlyTotals = Array(12).fill(0);
    payments.forEach((payment) => {
      const paymentDate = new Date(payment.paymentDate);
      const monthIndex = paymentDate.getUTCMonth();
      if (filter === "all" || paymentDate.getUTCFullYear() === parseInt(filter)) {
        monthlyTotals[monthIndex] += payment.totaAmount || 0;
      }
    });
    setSeries([{ name: "Total Payments", data: monthlyTotals }]);
  }, [payments, filter]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Revenue</p>
              <p className="text-sm font-medium">Monthly Overview</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="filter" className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Filter by Year:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </div>
      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart options={options} series={series} type="area" height={350} width={"100%"} />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
