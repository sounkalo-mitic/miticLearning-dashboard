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
import React, { useEffect, useState } from "react";
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
    role: string
}


const ECommerce: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [avis, setAvis] = useState<any[]>([]);
    const [totalStudent, setTotalStudent] = useState<string>('');
    const [totalUser, setTotalUser] = useState<string>('');
    const [totalCourse, setTotalCourse] = useState<string>('');
    const [payments, setPayments] = useState<Payment[]>([]);



    const user = useSelector((state: RootState) => state.user); // Accès à l'utilisateur depuis Redux
    // Vérifiez si le rôle de l'utilisateur est "teacher"
    const userId = user.role === "teacher" ? (user.id ? String(user.id) : undefined) : undefined;

    // charger les etudiants ou les utilisateurs depuis l'api
    const fetchStudents = async () => {
        try {
            if (!userId) {
                const data = await getAllUsers();
                if (data.data && Array.isArray(data.data)) {
                    setTotalUser(data.data.length);
                } else {
                    throw new Error('Les données reçues ne sont pas valides.');
                }
            } else {
                const data = await getStudentsByTeacher(userId);
                if (data.students && Array.isArray(data.students)) {
                    setStudents(data.students);
                    setTotalStudent(data.students.length);
                } else {
                    throw new Error('Les données reçues ne sont pas valides.');
                }
            }

        } catch (err) {
            console.error(err);
        }
    };

    //charger les commentaire
    const fetchAvis = async () => {
        const data = await getProfessorAvis(userId);
        setAvis(data.avis);
    };

    //charger les payments 
    const fetchPayments = async () => {
        try {
            const data = await getPaymentsByTeacher(userId);
            if (Array.isArray(data.payments)) {
                setPayments(data.payments);
            } else {
                console.error("Les données reçues ne sont pas valides :", data);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des cours :", error);
        }
    };

    //charger les cours 
    const fetchCourses = async () => {
        try {
            // Appelez getCourses avec ou sans userId selon le rôle
            const data = await getCourses(userId);
            // Vérifiez si les données reçues sont valides
            if (Array.isArray(data.data)) {
                setTotalCourse(data.data.length);
            } else {
                console.error("Les données reçues ne sont pas valides :", data);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des cours :", error);
        }
    };

    //supprimer un avis
    const handleAvisDeleted = (id: string) => {
        setAvis((prevAvis) => prevAvis.filter((item) => item._id !== id));
    };

    //calculer le total des payments
    function calculateTotalAmount(payments: any): number {
        if (!payments || !Array.isArray(payments)) {
            throw new Error("Invalid payment data format");
        }

        return payments.reduce((total: number, payment: any) => {
            return total + (payment.totaAmount || 0);
        }, 0);
    }

    // Colonnes du tableau
    const columns = [
        {
            name: 'Nom Étudiant',
            selector: (row: Student) => `${row.student.firstname} ${row.student.lastname}`,
            sortable: true,
            minWidth: '200px',
        },
        {
            name: 'Email',
            selector: (row: Student) => row.student.email,
            sortable: true,
        },
        {
            name: 'Numéro',
            selector: (row: Student) => row.student.phone,
            sortable: true,
            center: true,
        },
        {
            name: 'Cours',
            selector: (row: Student) => row.course.title,
            sortable: true,
            center: true,
        },
        {
            name: 'Durée',
            selector: (row: Student) => row.course.duration,
            sortable: true,
            center: true,
        },
    ];

    // Charger les donnees
    useEffect(() => {
        fetchAvis();
        fetchStudents();
        fetchCourses();
        fetchPayments();
    }, [user?.id]);


    return (
        <DefaultLayout>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                <CardDataStats title={user.role === "teacher" ? "total etudiant" : "total Utilisateurs"} total={user.role === "teacher" ? totalStudent : totalUser}>
                    <FontAwesomeIcon icon={faUser} color="#29015D" />
                </CardDataStats>

                <CardDataStats title={'Nombre total de cours'} total={totalCourse}>
                    <FontAwesomeIcon icon={faBook} color="#29015D" />
                </CardDataStats>

                <CardDataStats title={'Total des payments'} total={`${String(calculateTotalAmount(payments))} FCFA`}>
                    <FontAwesomeIcon icon={faMoneyBill} color="#29015D" />
                </CardDataStats>
            </div>

            <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                <ChartOne />
                <ChartTwo />
                <ChartFour />
                <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
                    {avis && avis.length > 0 ? (
                        avis.map((item) => (
                            <AvisItem
                                key={item._id}
                                item={item}
                                user={user}
                                onAvisDeleted={handleAvisDeleted}
                                canRespond={false}
                            />
                        ))
                    ) : (
                        <h2 className="text-2xl font-bold mb-6">Vous n'avez reçu aucun commentaire sur vos cours</h2>
                    )}
                </div>
                <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
                    <DataTableComponent
                        title="Inscription recentes"
                        columns={columns}
                        data={students}
                        pagination
                        highlightOnHover
                    />
                </div>
                <ChartThree />
                <ChartFive />
                <ChartSix />

            </div>
        </DefaultLayout>
    );
};

export default ECommerce;
