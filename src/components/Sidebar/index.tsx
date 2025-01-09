"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft, faBook, faBookOpenReader, faChartLine, faComment, faGear, faMoneyBill, faUserAlt, faUsersBetweenLines } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: (
          <FontAwesomeIcon icon={faChartLine} size="lg" />
        ),
        label: "dashboard",
        route: "/dashboard",
      }, {
        icon: (
          <FontAwesomeIcon icon={faBook} size='lg' />
        ),
        label: "Gestion des cours",
        route: "/courses",
      },
      {
        icon: (
          <FontAwesomeIcon icon={faUserAlt} size='lg' />
        ),
        label: "Gestion des eleves",
        route: "/student",
      },
      {
        icon: (
          <FontAwesomeIcon icon={faMoneyBill} size='lg' />
        ),
        label: "Gestion des finances",
        route: "/finance",
      },
      {
        icon: (
          <FontAwesomeIcon icon={faComment} size='lg' />
        ),
        label: "Gestion commentaires",
        route: "/comment",
      },
    ],
  },
  {
    name: "Admin",
    menuItems: [
      {
        icon: (
          <FontAwesomeIcon icon={faUsersBetweenLines} size='lg' />
        ),
        label: "Gestion Utilisateur",
        route: "/users",
      },
      {
        icon: (
          <FontAwesomeIcon icon={faGear} size='lg' />
        ),
        label: "paramètres de la plateforme",
        route: "#",
        children: [
          { label: "Gestion des catégories de cours.", route: "/category" },
          { label: "Gestion des level d'etudes.", route: "/level" },
          { label: "Gestion des metiers.", route: "/job" },
        ],
      }
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const user = useSelector((state: RootState) => state.user); // Accès à l'utilisateur depuis Redux

  // Filtrer les groupes de menus pour inclure uniquement ceux accessibles à l'utilisateur
  const filteredMenuGroups = menuGroups.filter((group) => {
    if (group.name === "Admin" && user.role !== "admin") {
      return false; // Ne pas inclure les menus Admin si l'utilisateur n'est pas admin
    }
    return true;
  });

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link href="/">
            <Image
              width={176}
              height={32}
              src={"/images/logo/logo.svg"}
              alt="Logo"
              priority
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <FontAwesomeIcon icon={faArrowAltCircleLeft} size='lg' />
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {filteredMenuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
