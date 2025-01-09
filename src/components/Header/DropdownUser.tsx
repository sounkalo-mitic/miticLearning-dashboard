"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faDoorOpen, faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux"; // Importez useSelector
import { useRouter } from "next/navigation";
import { clearUser } from "@/redux/userSlice";

const DropdownUser = () => {
  const dispatch = useDispatch();
  const router = useRouter(); // Initialisation de useRouter pour la redirection
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Accédez à l'état de l'utilisateur connecté dans le store Redux
  const user = useSelector((state: any) => state.user);
  console.log(user);


  // Si l'utilisateur est connecté, affichez ses informations
  const username = user?.username || "Nom de l'utilisateur"; // Utilisation d'un fallback si l'utilisateur n'est pas encore chargé
  const role = user?.role || "Rôle de l'utilisateur"; // Utilisation d'un fallback pour le rôle
  const userImage = user?.image || "/images/user/user-01.png"; // Utilisation d'une image par défaut si aucune image n'est disponible

  const handleLogout = () => {
    dispatch(clearUser());
    router.push("/forms/LoginForm"); // Redirection vers la page de connexion après la déconnexion
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {username}
          </span>
          <span className="block text-xs">{role}</span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <Image
            width={112}
            height={112}
            src={userImage}
            style={{
              width: "auto",
              height: "auto",
            }}
            alt="User"
          />
        </span>
        <FontAwesomeIcon icon={faArrowDown} />
      </Link>

      {/* <!-- Dropdown Start --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                href="/profile"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <FontAwesomeIcon icon={faUserAlt} />
                Mon profil
              </Link>
            </li>
          </ul>
          <button 
          className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base" 
          onClick={handleLogout} // methode pour ce deconnecter
          >
            <FontAwesomeIcon icon={faDoorOpen} />
            Log Out
          </button>
        </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
