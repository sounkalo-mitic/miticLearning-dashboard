"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faPhone, faEdit, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/services/userService";
import { setUser } from "@/redux/userSlice";
import { toast } from "react-toastify";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    role: "" as "admin" | "student" | "teacher" | "",
  });

  const [originalData, setOriginalData] = useState(formData);

  useEffect(() => {
    if (user) {
      const userData = {
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        role: ["admin", "student", "teacher"].includes(user.role) ? user.role : "",
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMode) return;

    try {
      const updatedUser = await updateUser(user._id, formData);
      if (updatedUser) {
        dispatch(setUser(updatedUser.user));
        setEditMode(false);
        setOriginalData(formData);
        toast.success("Profil mis à jour avec succès !");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil.");
    }
  };

  const handleEdit = () => {
    if (typeof window !== "undefined" && window.confirm("Voulez-vous vraiment modifier votre profil ?")) {
      setEditMode(true);
    }
  };
  

  const handleCancel = () => {
    if (typeof window !== "undefined" && window.confirm("Voulez-vous annuler vos modifications ?")) {
      setFormData(originalData);
      setEditMode(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 animate-fadeIn">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} /> Profil
        </h1>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-600">Prénom</label>
              <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} disabled={!editMode} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="text-gray-600">Nom</label>
              <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} disabled={!editMode} className="w-full p-2 border rounded-md" />
            </div>
          </div>
          <div>
            <label className="text-gray-600">Nom utilisateur</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} disabled={!editMode} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="text-gray-600">Email</label>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} />
              <input type="email" name="email" value={formData.email} disabled className="w-full p-2 border rounded-md bg-gray-100" />
            </div>
          </div>
          <div>
            <label className="text-gray-600">Téléphone</label>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone} />
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} disabled={!editMode} className="w-full p-2 border rounded-md" />
            </div>
          </div>
          <div>
            <label className="text-gray-600">Adresse</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} disabled={!editMode} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="text-gray-600">Rôle</label>
            <input type="text" name="role" value={formData.role} disabled className="w-full p-2 border rounded-md bg-gray-100" />
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {!editMode ? (
              <button type="button" onClick={handleEdit} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-transform transform hover:scale-105">
                <FontAwesomeIcon icon={faEdit} /> Modifier
              </button>
            ) : (
              <>
                <button type="submit" className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-transform transform hover:scale-105">
                  <FontAwesomeIcon icon={faSave} /> Enregistrer
                </button>
                <button type="button" onClick={handleCancel} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-transform transform hover:scale-105">
                  <FontAwesomeIcon icon={faTimes} /> Annuler
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
