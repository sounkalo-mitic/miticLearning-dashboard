"use client";
import React, { useEffect, useState, useCallback } from "react";
import CardDataStats from "@/components/CardDataStats";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import DataTableComponent from "@/components/Tables/DataTable";
import DefaultLayout from "../../components/Layouts/DefaultLayout";
import { getPaymentsByTeacher } from "@/services/paymentService";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Payment } from "@/types/payment";

// Définir un type explicite pour les colonnes si nécessaire
const Finance: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const user = useSelector((state: RootState) => state.user); // Accès à l'utilisateur depuis Redux

    // Fonction de récupération des paiements
    const fetchPayments = useCallback(async () => {
        try {
            const userId = user.role === "teacher" ? (user.id ? String(user.id) : undefined) : undefined;
            const data = await getPaymentsByTeacher(userId);
            if (Array.isArray(data.payments)) {
                setPayments(data.payments);
            } else {
                console.error("Les données reçues ne sont pas valides :", data);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des paiements :", error);
        }
    }, [user.role, user.id]); // useCallback pour éviter les recalculs inutiles

    // Charger les paiements 
    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]); // Inclure fetchPayments dans les dépendances

    // Colonnes du tableau
    const columns = [
        {
            name: "Student Name",
            selector: (row: Payment) => `${row.user_id.firstname} ${row.user_id.lastname}`,
            sortable: true,
            minWidth: "200px",
        },
        {
            name: "Numero",
            selector: (row: Payment) => row.user_id.phone,
            sortable: true,
        },
        {
            name: "Cours",
            selector: (row: Payment) => row.course_id.title,
            sortable: true,
            center: true,
        },
        {
            name: "Montant",
            selector: (row: Payment) => `${row.totaAmount} FCFA`,
            sortable: true,
            center: true,
        },
        {
            name: "Date",
            selector: (row: Payment) => new Date(row.createdAt).toLocaleDateString("fr-FR"),
            sortable: true,
            center: true,
        },
        {
            name: "Status",
            selector: (row: Payment) => row.status,
            sortable: true,
            center: true,
            cell: (row: Payment) => (
                <span
                    className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${row.status === "success" ? "bg-success text-white" : "bg-warning text-white"
                        }`}
                >
                    {row.status}
                </span>
            ),
        }
    ];

    // Calculer le total des paiements
    function calculateTotalAmount(payments: Payment[]): number {
        if (!payments || !Array.isArray(payments)) {
            throw new Error("Invalid payment data format");
        }

        return payments.reduce((total: number, payment: Payment) => {
            return total + (payment.totaAmount || 0);
        }, 0);
    }

    return (
        <DefaultLayout>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                <CardDataStats title="Nbre total Payment" total={String(payments.length)}>
                    <FontAwesomeIcon icon={faList} color="#29015D" />
                </CardDataStats>
                <CardDataStats title="Montant Total" total={String(calculateTotalAmount(payments))}>
                    <FontAwesomeIcon icon={faMoneyBill} color="#29015D" />
                </CardDataStats>
            </div>

            <div className="pt-5">
                <DataTableComponent
                    title="Listes des paiements"
                    columns={columns}
                    data={payments}
                    pagination
                    highlightOnHover
                />
            </div>
        </DefaultLayout>
    );
};

export default Finance;
