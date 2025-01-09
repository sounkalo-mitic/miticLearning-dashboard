"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getAllCategories } from "@/services/categoryService";
import { Category } from "@/types/category";
import { StudyLevel } from "@/types/studyLevel";
import { getAllStudyLevels } from "@/services/studyLevelService";
import { Job } from "@/types/job";
import { getAllJobs } from "@/services/jobService";

interface Section {
    title: string;
    description: string;
    type: string;
    order: string;
    path_image: File | null;
    path_video: File | null;
}

interface Lesson {
    title: string;
    description: string;
    duration: string;
    order: string;
    sections: Section[];
}

const AddCourseForm: React.FC = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [studyLevels, setStudyLevels] = useState<StudyLevel[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);

    const [course, setCourse] = useState({
        title: "",
        description: "",
        price: 0,
        isCertified: false,
        duration: "",
        created_by: "67585d9d262ba108229acd99",
        studyLevel_id: "",
        job_id: "",
        category_id: "",
        path_image: null as File | null,
        path_video: null as File | null,
    });

    // methode pour récupérer les catégories
    const loadCategories = async () => {
        try {
            const data = await getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error("Erreur lors du chargement des catégories :", error);
        }
    };

    // methode pour récupérer les levels
    const loadStudyLevels = async () => {
        try {
            const data = await getAllStudyLevels();
            setStudyLevels(data);
        } catch (error) {
            console.error("Erreur lors du chargement des catégories :", error);
        }
    };

    // Service pour récupérer les jobs
    const loadJob = async () => {
        try {
            const data = await getAllJobs();
            setJobs(data);
        } catch (error) {
            console.error("Erreur lors du chargement des catégories :", error);
        }
    };

    useEffect(() => {
        loadCategories();
        loadJob();
        loadStudyLevels();
    }, []);

    const [lessons, setLessons] = useState<Lesson[]>([
        {
            title: "",
            description: "",
            duration: "",
            order: "1",
            sections: [
                {
                    title: "",
                    description: "",
                    type: "cours",
                    order: "1",
                    path_image: null,
                    path_video: null,
                },
            ],
        },
    ]);

    const handleCourseChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, type } = e.target;

        setCourse((prev) => {
            if (type === "checkbox" && e.target instanceof HTMLInputElement) {
                // Gestion des checkboxes
                return { ...prev, [name]: e.target.checked };
            }

            // Gestion des autres types de champs
            return { ...prev, [name]: e.target.value };
        });
    };



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (e.target.files && e.target.files[0]) {
            setCourse((prev) => ({ ...prev, [field]: e.target.files && e.target.files[0] }));
        }
    };

    const handleLessonChange = <K extends keyof Lesson>(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        lessonIndex: number,
        field: K
    ) => {
        const updatedLessons = [...lessons];
        updatedLessons[lessonIndex][field] = e.target.value as Lesson[K];
        setLessons(updatedLessons);
    };

    const handleSectionChange = <K extends keyof Section>(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        lessonIndex: number,
        sectionIndex: number,
        field: K
    ) => {
        const updatedLessons = [...lessons];
        updatedLessons[lessonIndex].sections[sectionIndex][field] = e.target.value as Section[K];
        setLessons(updatedLessons);
    };

    const handleAddLesson = () => {
        setLessons((prev) => [
            ...prev,
            {
                title: "",
                description: "",
                duration: "",
                order: (prev.length + 1).toString(),
                sections: [
                    {
                        title: "",
                        description: "",
                        type: "cours",
                        order: "1",
                        path_image: null,
                        path_video: null,
                    },
                ],
            },
        ]);
    };

    const handleAddSection = (lessonIndex: number) => {
        const updatedLessons = [...lessons];
        updatedLessons[lessonIndex].sections.push({
            title: "",
            description: "",
            type: "cours",
            order: (updatedLessons[lessonIndex].sections.length + 1).toString(),
            path_image: null,
            path_video: null,
        });
        setLessons(updatedLessons);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        const formData = new FormData();
        Object.entries(course).forEach(([key, value]) => {
            if (value) {
                if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, value.toString());
                }
            }
        });

        formData.append("lessons", JSON.stringify(lessons));

        try {
            const response = await axios.post("http://localhost:4444/api/course/allInfos", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Cours ajouté avec succès !");
            console.log(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || "Erreur lors de l'ajout du cours.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DefaultLayout>
            <div className="p-6 bg-white rounded shadow-md">
                <h1 className="text-2xl font-bold mb-6">Ajouter un cours</h1>
                {step === 1 && (
                    <div>
                        <h2 className="text-lg font-bold mb-4">Étape 1: Informations sur le cours</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="title"
                                placeholder="Titre"
                                value={course.title}
                                onChange={handleCourseChange}
                                className="border p-2 rounded"
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={course.description}
                                onChange={handleCourseChange}
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="duration"
                                placeholder="Entrer la durer en heure du cours"
                                value={course.duration}
                                onChange={handleCourseChange}
                                className="border p-2 rounded"
                            />
                            <input
                                type="number"
                                name="price"
                                placeholder="Prix"
                                value={course.price}
                                onChange={handleCourseChange}
                                className="border p-2 rounded"
                            />
                            <label className="flex items-center border p-2 rounded">
                                <input
                                    type="checkbox"
                                    name="isCertified"
                                    checked={course.isCertified}
                                    onChange={handleCourseChange}
                                />
                                <span className="ml-2">
                                    {course.isCertified ? "Certifié" : "Non certifié"}
                                </span>
                            </label>

                            <select
                                name="category_id"
                                value={course.category_id ?? ""}
                                onChange={handleCourseChange}
                                className="border p-2 rounded w-full"
                            >
                                <option value="" disabled>
                                    Sélectionnez une catégorie
                                </option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="studyLevel_id"
                                value={course.studyLevel_id ?? ""}
                                onChange={handleCourseChange}
                                className="border p-2 rounded w-full"
                            >
                                <option value="" disabled>
                                    Sélectionnez un niveau d'etude
                                </option>
                                {studyLevels.map((level) => (
                                    <option key={level._id} value={level._id}>
                                        {level.name}
                                    </option>
                                ))}
                            </select>


                            <select
                                name="job_id"
                                value={course.job_id ?? ""}
                                onChange={handleCourseChange}
                                className="border p-2 rounded w-full"
                            >
                                <option value="" disabled>
                                    Sélectionnez le metier concerner
                                </option>
                                {jobs.map((job) => (
                                    <option key={job._id} value={job._id}>
                                        {job.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="file"
                                onChange={(e) => handleFileChange(e, "path_image")}
                                className="border p-2 rounded"
                            />
                            <input
                                type="file"
                                onChange={(e) => handleFileChange(e, "path_video")}
                                className="border p-2 rounded"
                            />
                        </div>
                        <button onClick={() => setStep(2)} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                            Suivant <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2 className="text-lg font-bold mb-4">Étape 2: Ajouter des leçons</h2>
                        {lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="mb-4 border-b pb-4">
                                <input
                                    type="text"
                                    placeholder="Titre de la leçon"
                                    value={lesson.title}
                                    onChange={(e) => handleLessonChange(e, lessonIndex, "title")}
                                    className="border p-2 rounded mb-2 w-full"
                                />
                                <textarea
                                    placeholder="Description"
                                    value={lesson.description}
                                    onChange={(e) => handleLessonChange(e, lessonIndex, "description")}
                                    className="border p-2 rounded mb-2 w-full"
                                />
                                <input
                                    type="text"
                                    placeholder="Durée"
                                    value={lesson.duration}
                                    onChange={(e) => handleLessonChange(e, lessonIndex, "duration")}
                                    className="border p-2 rounded mb-2 w-full"
                                />
                                <div>
                                    {lesson.sections.map((section, sectionIndex) => (
                                        <div key={sectionIndex} className="mb-2">
                                            <input
                                                type="text"
                                                placeholder="Titre de la section"
                                                value={section.title}
                                                onChange={(e) => handleSectionChange(e, lessonIndex, sectionIndex, "title")}
                                                className="border p-2 rounded mb-2 w-full"
                                            />
                                            <textarea
                                                placeholder="Description"
                                                value={section.description}
                                                onChange={(e) => handleSectionChange(e, lessonIndex, sectionIndex, "description")}
                                                className="border p-2 rounded mb-2 w-full"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleAddSection(lessonIndex)}
                                        className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                                    >
                                        Ajouter une section <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={handleAddLesson}
                            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                        >
                            Ajouter une leçon <FontAwesomeIcon icon={faPlus} />
                        </button>
                        <button onClick={() => setStep(1)} className="bg-red-500 text-white px-4 py-2 rounded mt-4 mr-2">
                            <FontAwesomeIcon icon={faArrowLeft} /> Retour
                        </button>
                        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                            {loading ? "Chargement..." : "Soumettre"}
                        </button>
                    </div>
                )}
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </DefaultLayout>
    );
};

export default AddCourseForm;
