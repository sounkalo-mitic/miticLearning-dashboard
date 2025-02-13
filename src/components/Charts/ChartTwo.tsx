"use client";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { getCourseEnrollmentStats } from "@/services/courseService";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Chargement dynamique d'ApexCharts pour éviter les erreurs SSR (Next.js)
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ChartTwo: React.FC = () => {
  const [chartData, setChartData] = useState<{ series: any[]; options: ApexOptions } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all"); // État du filtre sélectionné

  // Récupération des informations de l'utilisateur depuis Redux
  const user = useSelector((state: RootState) => state.user);

  /**
   * Fonction pour récupérer les statistiques d'inscription aux cours
   */
  const fetchEnrollmentStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = user.role === "teacher" ? user.id?.toString() : undefined;
      const data = await getCourseEnrollmentStats(userId);

      // Filtrage des données selon le filtre sélectionné
      const filteredData = data.filter((item: { studentsCount: number }) => {
        if (filter === "popular") return item.studentsCount > 50;
        if (filter === "less-popular") return item.studentsCount <= 50;
        return true; // "all"
      });

      // Extraction des titres et des nombres d'étudiants
      const courseTitles = filteredData.map((item: { courseTitle: string }) => item.courseTitle);
      const studentsCounts = filteredData.map((item: { studentsCount: number }) => item.studentsCount);

      // Mise à jour de l'état du graphique
      setChartData({
        series: [{ name: "Inscriptions Étudiants", data: studentsCounts }],
        options: {
          chart: {
            type: "bar",
            height: 335,
            stacked: true,
            toolbar: { show: false },
            zoom: { enabled: false },
            fontFamily: "Satoshi, sans-serif",
          },
          xaxis: {
            categories: courseTitles,
            title: { text: "Cours" },
          },
          yaxis: {
            title: { text: "Nombre d'étudiants inscrits" },
          },
          title: {
            text: "Nombre d'inscriptions par cours",
            align: "center",
          },
          colors: ["#3C50E0", "#80CAEE"],
          plotOptions: {
            bar: { horizontal: false, columnWidth: "25%" },
          },
          dataLabels: { enabled: false },
          legend: {
            position: "top",
            horizontalAlign: "left",
          },
          fill: { opacity: 1 },
        },
      });
    } catch (err) {
      setError("Erreur lors de la récupération des données des inscriptions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.id, user.role, filter]);

  // Exécution de la récupération des données au montage et lors des changements d'état
  useEffect(() => {
    fetchEnrollmentStats();
  }, [fetchEnrollmentStats]);

  // Options de filtrage pour éviter une recréation inutile
  const filterOptions = useMemo(
    () => [
      { value: "all", label: "Tous les cours" },
      { value: "popular", label: "Cours populaires (50+ étudiants)" },
      { value: "less-popular", label: "Cours moins populaires (-50 étudiants)" },
    ],
    []
  );

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 flex justify-between gap-4">
        <h4 className="text-xl font-semibold text-black dark:text-white">Inscriptions</h4>
        {/* Sélecteur de filtre */}
        <select
          className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none border dark:bg-boxdark w-48"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Gestion du chargement et des erreurs */}
      {loading ? (
        <div>Chargement des données...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div id="chartTwo" className="-mb-9 -ml-5">
          <ReactApexChart options={chartData?.options || {}} series={chartData?.series || []} type="bar" height={350} width="100%" />
        </div>
      )}
    </div>
  );
};

export default ChartTwo;
