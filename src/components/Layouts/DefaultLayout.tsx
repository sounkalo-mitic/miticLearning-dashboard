'use client';
import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux'; // Pas besoin de Provider ici
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { RootState } from '@/redux/store'; // Utilisation d'un type pour le state global

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user); // Accès à l'utilisateur depuis Redux
  const router = useRouter();

  useEffect(() => {
    if (!user) { // Si l'utilisateur n'est pas authentifié
      router.push('/forms/LoginForm'); // Redirige vers la page de connexion
    }
    console.log(user);
    
  }, [user, router]); // La redirection dépend de `user`

  // Si l'utilisateur n'est pas encore chargé, vous pouvez afficher un écran de chargement ou rien
  // if (!user) return <div>Loading...</div>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="relative flex flex-1 flex-col lg:ml-72.5">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
