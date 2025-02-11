"use client";
import AvisItem from "@/components/AvisItem/page";
import CardDataStats from "@/components/CardDataStats";
import ChartFive from "@/components/Charts/ChartFive";
import ChartFour from "@/components/Charts/ChartFour";
import ChartOne from "@/components/Charts/ChartOne";
import ChartSix from "@/components/Charts/ChartSix";
import ChartThree from "@/components/Charts/ChartThree";
import ChartTwo from "@/components/Charts/ChartTwo";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DataTableComponent from "@/components/Tables/DataTable";
import { RootState } from "@/redux/store";
import { getProfessorAvis } from "@/services/avisService";
import { getCourses } from "@/services/courseService";
import { getPaymentsByTeacher } from "@/services/paymentService";
import { getStudentsByTeacher } from "@/services/studentService";
import { getAllUsers } from "@/services/userService";
import { Payment } from "@/types/payment";
import { faBook, faMoneyBill, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

interface Student {
    student: {
        firstname: string;
        lastname: string;
        email: string;
        phone: string;
    };
    course: {
        title: string;
        duration: string;
    };
    role: string;
}

const ECommerce: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [avis, setAvis] = useState<any[]>([]);
    const [totalStudent, setTotalStudent] = useState<string>('0');
    const [totalUser, setTotalUser] = useState<string>('0');
    const [totalCourse, setTotalCourse] = useState<string>('0');
    const [payments, setPayments] = useState<Payment[]>([]);

    const user = useSelector((state: RootState) => state.user);
    const userId = user.role === "teacher" ? String(user.id) : undefined;

    // Fonction pour charger les étudiants ou utilisateurs
    const fetchStudents = useCallback(async () => {
        try {
            if (!userId) {
                const data = await getAllUsers();
                setTotalUser(data?.data?.length?.toString() || '0');
            } else {
                const data = await getStudentsByTeacher(userId);
                setStudents(data.students || []);
                setTotalStudent(data?.students?.length?.toString() || '0');
            }
        } catch (err) {
            console.error(err);
        }
    }, [userId]);

    // Fonction pour charger les avis
    const fetchAvis = useCallback(async () => {
        if (userId) {
            const data = await getProfessorAvis(userId);
            setAvis(data.avis || []);
        }
    }, [userId]);

    // Fonction pour charger les paiements
    const fetchPayments = useCallback(async () => {
        if (userId) {
            try {
                const data = await getPaymentsByTeacher(userId);
                setPayments(data.payments || []);
            } catch (error) {
                console.error("Erreur lors du chargement des paiements :", error);
            }
        }
    }, [userId]);

    // Fonction pour charger les cours
    const fetchCourses = useCallback(async () => {
        try {
            const data = await getCourses(userId);
            setTotalCourse(data?.data?.length?.toString() || '0');
        } catch (error) {
            console.error("Erreur lors du chargement des cours :", error);
        }
    }, [userId]);

    useEffect(() => {
        fetchAvis();
        fetchStudents();
        fetchCourses();
        fetchPayments();
    }, [fetchAvis, fetchStudents, fetchCourses, fetchPayments]);

    const handleAvisDeleted = (id: string) => {
        setAvis((prevAvis) => prevAvis.filter((item) => item._id !== id));
    };

    const calculateTotalAmount = (payments: Payment[]): number => {
        return payments.reduce((total, payment) => total + (payment.totaAmount || 0), 0);
    };

    const columns = [
        {
            name: "Nom Étudiant",
            selector: (row: Student) => `${row.student.firstname} ${row.student.lastname}`,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row: Student) => row.student.email,
            sortable: true,
        },
        {
            name: "Numéro",
            selector: (row: Student) => row.student.phone,
            sortable: true,
        },
        {
            name: "Cours",
            selector: (row: Student) => row.course.title,
            sortable: true,
        },
        {
            name: "Durée",
            selector: (row: Student) => row.course.duration,
            sortable: true,
        },
    ];

    return (
        <DefaultLayout>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <CardDataStats title={user.role === "teacher" ? "Total Étudiants" : "Total Utilisateurs"} total={user.role === "teacher" ? totalStudent : totalUser}>
                    <FontAwesomeIcon icon={faUser} />
                </CardDataStats>
                <CardDataStats title="Nombre total de cours" total={totalCourse}>
                    <FontAwesomeIcon icon={faBook} />
                </CardDataStats>
                <CardDataStats title="Total des paiements" total={`${calculateTotalAmount(payments)} FCFA`}>
                    <FontAwesomeIcon icon={faMoneyBill} />
                </CardDataStats>
            </div>
            <div className="mt-4 grid grid-cols-12 gap-4">
                <ChartOne />
                <ChartTwo />
                <ChartFour />
                <div className="col-span-12 xl:col-span-4">
                    {avis.length > 0 ? avis.map((item) => (
                        <AvisItem key={item._id} item={item} user={user} onAvisDeleted={handleAvisDeleted} canRespond={false} />
                    )) : (
                        <h2 className="text-2xl font-bold mb-6">Vous n&apos;avez reçu aucun commentaire sur vos cours</h2>
                    )}
                </div>
                <div className="col-span-12 xl:col-span-8">
                    <DataTableComponent title="Inscriptions récentes" columns={columns} data={students} pagination highlightOnHover />
                </div>
                <ChartThree />
                <ChartFive />
                <ChartSix />
            </div>
        </DefaultLayout>
    );
};

export default ECommerce;
