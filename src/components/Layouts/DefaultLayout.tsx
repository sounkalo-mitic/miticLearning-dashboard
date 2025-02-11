'use client';
import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { RootState } from '@/redux/store';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true); // État pour éviter le rendu avant la vérification
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user || (user.role !== "teacher" && user.role !== "admin")) {
      router.push('/forms/LoginForm');
    } else {
      setIsChecking(false); // Laisse afficher la page si l'utilisateur est valide
    }
  }, [user, router]);

  // Tant que la vérification n'est pas terminée, afficher un écran blanc (ou un loader)
  if (isChecking) return  <div className="flex justify-center items-center h-screen">Chargement...</div>;

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
