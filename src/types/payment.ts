 // Définir un type pour les paiements
 export interface Payment {
    user_id: {
        firstname: string;
        lastname: string;
        phone: string;
    };
    course_id: {
        title: string;
    };
    totaAmount: number;
    paymentDate: string
    createdAt: string;
    status: string;
}