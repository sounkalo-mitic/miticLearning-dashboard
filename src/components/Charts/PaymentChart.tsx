import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { ApexOptions } from 'apexcharts';

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
    // labels: {
    //   show: false,
    //   position: "top",
    // },
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
        strokeOpacity: 0.9,
        strokeDashArray: 0,
        fillOpacity: 1,
        discrete: [],
        hover: {
            size: undefined,
            sizeOffset: 5,
        },
    },
    xaxis: {
        type: "category",
        categories: [
            "Sep",
            "Oct",
            "Nov",
            "Dec",
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
        ],
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
    },
    yaxis: {
        title: {
            style: {
                fontSize: "0px",
            },
        },
        min: 0,
        max: 100,
    },
};

const PaymentChart: React.FC<{ userId: string; year: number }> = ({ userId, year }) => {
    const [series, setSeries] = useState([{ name: "Total Payments", data: Array(12).fill(0) }]);
    

    interface ChartOneState {
        series: {
            name: string;
            data: number[];
        }[];
    }

    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                const response = await axios.get(`http://localhost:4444/api/payments/monthly-payments`, {
                    params: { userId, year },
                });
                setSeries([{ name: "Total Payments", data: response.data.monthlyData }]);
            } catch (error) {
                console.error("Error fetching payment data:", error);
            }
        };

        fetchPaymentData();
    }, [userId, year]);

    return (
        <div>
            <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={350}
                width="100%"
            />
        </div>
    );
};

export default PaymentChart;
