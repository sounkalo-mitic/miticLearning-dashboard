'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { setUser } from '@/redux/userSlice';
import { useRouter } from 'next/navigation'; // Importer le hook useRouter

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter(); // Initialiser useRouter

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:4444/api/login', {
                email,
                phone,
                username,
                password,
            });

            // Mise à jour de l'état Redux avec les informations de l'utilisateur
            dispatch(setUser(response.data.user));
            setLoading(false);

            // Redirection vers la page d'accueil ou une autre page après la connexion réussie
            router.push('/courses');

        } catch (err: any) {
            setError(
                err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
            );
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded shadow-md space-y-4 mt-21">
            <h2 className="text-2xl font-bold mb-4 text-center">Connexion</h2>
            {error && (
                <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Nom d'utilisateur</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none"
                    disabled={loading}
                >
                    {loading ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                        'Se connecter'
                    )}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
