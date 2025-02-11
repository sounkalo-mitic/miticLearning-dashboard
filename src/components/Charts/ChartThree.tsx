import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getStudentsByTeacher } from "@/services/studentService";

const ChartThree = () => {
  const [chartData, setChartData] = useState<{
    categories: string[];
    series: number[];
  }>({
    categories: [],
    series: [],
  });

  const [filter, setFilter] = useState<string>("all"); // Filtre initial (tous)

  // Fonction pour appliquer un filtre basé sur la période
  const filteredEnrollments = (enrollments: any[], filter: string) => {
    if (filter === "lastYear") {
      return enrollments.filter((enrollment) => {
        const enrollmentYear = new Date(enrollment.createdAt).getFullYear();
        return enrollmentYear === new Date().getFullYear() - 1; // L'année précédente
      });
    } else if (filter === "thisYear") {
      return enrollments.filter((enrollment) => {
        const enrollmentYear = new Date(enrollment.createdAt).getFullYear();
        return enrollmentYear === new Date().getFullYear(); // L'année actuelle
      });
    }
    return enrollments; // Par défaut, aucun filtre
  };

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        // Récupérer les inscriptions depuis l'API
        const enrollments = await getStudentsByTeacher();

        // Appliquer le filtre aux inscriptions
        const filteredData = filteredEnrollments(enrollments, filter);

        // Préparer les données
        const courseCounts: Record<string, number> = {};
        filteredData.forEach((enrollment: any) => {
          const courseTitle = enrollment.course_id.title;
          if (courseCounts[courseTitle]) {
            courseCounts[courseTitle]++;
          } else {
            courseCounts[courseTitle] = 1;
          }
        });

        // Extraire les catégories et les séries
        const categories = Object.keys(courseCounts);
        const series = Object.values(courseCounts);

        setChartData({
          categories,
          series,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des inscriptions :", error);
      }
    };

    fetchEnrollments();
  }, [filter]); // Recharger les données quand le filtre change

  const options = {
    chart: {
      id: "popular-courses",
      type: "bar",
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: "Cours",
      },
    },
    yaxis: {
      title: {
        text: "Nombre d'inscriptions",
      },
    },
    title: {
      text: "Statistiques des Cours les Plus Populaires",
      align: "center",
    },
    colors: ["#546E7A"],
  };

  const series = [
    {
      name: "Inscriptions",
      data: chartData.series,
    },
  ];

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex min-w-47.5">
          <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
            <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
          </span>
          <div className="w-full">
            <p className="font-semibold text-primary">
              Statistiques des Cours les Plus Populaires
            </p>
            {/* <p className="text-sm font-medium">Par utilisateur</p> */}
          </div>
        </div>
      </div>

      {/* Zone de filtrage */}
      <div className="mb-4">
        <label htmlFor="filter" className="mr-2 text-sm font-medium">Filtrer par période:</label>
        <select
          id="filter"
          className="border border-gray-300 p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Tous</option>
          <option value="thisYear">Cette année</option>
          <option value="lastYear">année dernière</option>
        </select>
      </div>

      <div>
        <div id="roleChart" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
