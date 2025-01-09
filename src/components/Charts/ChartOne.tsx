"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Payment } from "@/types/payment";
import { getPaymentsByTeacher } from "@/services/paymentService";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

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
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "straight",
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#3056D3", "#80CAEE"],
    strokeWidth: 3,
    fillOpacity: 1,
  },
  xaxis: {
    type: "category",
    categories: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    min: 0,
  },
};

const ChartOne: React.FC = () => {
  const [series, setSeries] = useState([{ name: "Total Payments", data: Array(12).fill(0) }]);
  const [filter, setFilter] = useState("all"); // "all" by default
  const user = useSelector((state: RootState) => state.user); // Accès à l'utilisateur depuis Redux
  const [payments, setPayments] = useState<Payment[]>([]);

  const fetchPayments = async () => {
    try {
      const userId = user.role === "teacher" ? (user.id ? String(user.id) : undefined) : undefined;
      const data = await getPaymentsByTeacher(userId);
      if (Array.isArray(data.payments)) {
        setPayments(data.payments);
        formatPayments(data.payments);
      } else {
        console.error("Invalid data format:", data);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const formatPayments = (payments: Payment[]) => {
    const monthlyTotals = Array(12).fill(0);

    payments.forEach((payment) => {
      const paymentDate = new Date(payment.paymentDate);
      const monthIndex = paymentDate.getUTCMonth(); // 0 for Jan, 1 for Feb, etc.

      if (filter === "all" || paymentDate.getUTCFullYear() === parseInt(filter)) {
        monthlyTotals[monthIndex] += payment.totaAmount || 0;
      }
    });

    setSeries([{ name: "Total Payments", data: monthlyTotals }]);
  };

  useEffect(() => {
    fetchPayments();
  }, [user?.id, filter]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

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
            onChange={handleFilterChange}
            className="rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            {/* Add more years as needed */}
          </select>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
