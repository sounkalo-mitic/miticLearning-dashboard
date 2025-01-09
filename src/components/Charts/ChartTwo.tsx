"use client";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getCourseEnrollmentStats } from "@/services/courseService";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ChartTwo: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all"); // État pour le filtre
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchEnrollmentStats = async () => {
      try {
        const userId =
          user.role === "teacher" ? (user.id ? String(user.id) : undefined) : undefined;

        const data = await getCourseEnrollmentStats(userId);

        // Filtrer les données en fonction du filtre sélectionné
        const filteredData =
          filter === "all"
            ? data
            : data.filter((item: any) =>
                filter === "popular" ? item.studentsCount > 50 : item.studentsCount <= 50
              );

        const courseTitles = filteredData.map((item: { courseTitle: string }) => item.courseTitle);
        const studentsCounts = filteredData.map((item: { studentsCount: number }) => item.studentsCount);

        setChartData({
          series: [
            {
              name: "Inscription Étudiants",
              data: studentsCounts,
            },
          ],
          options: {
            xaxis: {
              categories: courseTitles,
              title: {
                text: "Cours",
              },
            },
            yaxis: {
              title: {
                text: "Nombre d'étudiants inscrits",
              },
            },
            title: {
              text: "Nombre d'inscriptions par cours",
              align: "center",
            },
            colors: ["#3C50E0", "#80CAEE"],
            chart: {
              fontFamily: "Satoshi, sans-serif",
              type: "bar",
              height: 335,
              stacked: true,
              toolbar: {
                show: false,
              },
              zoom: {
                enabled: false,
              },
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: "25%",
              },
            },
            dataLabels: {
              enabled: false,
            },
            legend: {
              position: "top",
              horizontalAlign: "left",
            },
            fill: {
              opacity: 1,
            },
          },
        });
      } catch (err) {
        setError("Erreur lors de la récupération des données des inscriptions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentStats();
  }, [user?.id, filter]); // Dépendance au filtre

  if (loading) {
    return <div>Chargement des données...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">Inscriptions</h4>
        </div>
        {/* Zone de filtrage */}
        <div>
          <select
            className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none border dark:bg-boxdark w-48"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tous les cours</option>
            <option value="popular">Cours populaires (50+ étudiants)</option>
            <option value="less-popular">Cours moins populaires (-50 étudiants)</option>
          </select>
        </div>
      </div>
      <div>
        <div id="chartTwo" className="-mb-9 -ml-5">
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
