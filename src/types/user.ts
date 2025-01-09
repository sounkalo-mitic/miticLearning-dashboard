export type User = {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
    status: string;
    studyLevel?: {
        _id: string;
        name: string; 
    };
}