"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ChevronRight, ChevronLeft, Clock, Tag, Award, BookOpen, NotebookPen,
    ChartColumnStacked, Briefcase, User
} from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { CourseResponse } from "@/types/course";
import { getCourseDetails } from "@/services/courseService";

// Types pour les leçons et sections
type Section = {
    id: string;
    title: string;
    image?: string;
    text: string;
};

type Lesson = {
    id: string;
    title: string;
    sections: Section[];
};

type Course = {
    title: string;
    duration: string;
    image: string;
    price: number;
    isCertifying: boolean;
    lessons: Lesson[];
};

const PreviewCourse: React.FC<{ courseId: string }> = ({ courseId }) => {
    const [courseInfo, setCourseInfo] = useState<CourseResponse | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Obtenez les leçons et sections actuelles
    const currentLesson = courseInfo?.lessons.find(lesson => lesson._id === selectedLesson);
    const currentSection = currentLesson?.sections.find(section => section._id === selectedSection);

    const handleNextSection = () => {
        if (currentLesson && currentSection) {
            const currentIndex = currentLesson.sections.findIndex(s => s._id === currentSection._id);
            if (currentIndex < currentLesson.sections.length - 1) {
                setSelectedSection(currentLesson.sections[currentIndex + 1]._id);
            }
        }
    };

    const handlePrevSection = () => {
        if (currentLesson && currentSection) {
            const currentIndex = currentLesson.sections.findIndex(s => s._id === currentSection._id);
            if (currentIndex > 0) {
                setSelectedSection(currentLesson.sections[currentIndex - 1]._id);
            }
        }
    };

    const fetchCourseDetails = async () => {
        try {
            const data = await getCourseDetails(courseId);
            setCourseInfo(data);
            // Initialiser les leçons et sections
            const firstLesson = data.lessons[0];
            setSelectedLesson(firstLesson._id);
            setSelectedSection(firstLesson.sections[0]._id);
        } catch (error) {
            console.error("Erreur lors de la récupération des détails du cours :", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="flex flex-col h-screen p-6 bg-gray-100">
            {/* Informations principales */}
            <motion.div
                className="bg-white rounded-lg shadow p-6 flex gap-6 items-start mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Image du cours */}
                <img
                    src={`http://localhost:4444${courseInfo?.course.path_image}`}
                    alt="Image du cours"
                    className="w-40 h-40 rounded object-cover"
                />

                {/* Informations principales */}
                <div>
                    <h2 className="text-2xl font-bold mb-2">{courseInfo?.course.title}</h2>
                    <p className="text-gray-600 mb-4">{courseInfo?.course.description}</p>

                    <div className="flex items-center gap-4 text-gray-700">
                        <div className="flex items-center gap-2">
                            <User size={20} className="text-purple-600" />
                            <span>{`Professeur : ${courseInfo?.course.created_by.firstname} ${courseInfo?.course.created_by.lastname}`}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BookOpen size={20} className="text-purple-600" />
                            <span>Nombre de leçons : {courseInfo?.lessons.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={20} className="text-blue-600" />
                            <span>Durée : {courseInfo?.course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tag size={20} className="text-green-600" />
                            <span>Prix : {courseInfo?.course.price} FCFA</span>
                        </div>
                        {/* Icône pour le level */}
                        <div className="flex items-center gap-2">
                            <NotebookPen size={20} className="text-blue-600" />
                            <span>level d'etude : {courseInfo?.course.studyLevel_id ? courseInfo?.course.studyLevel_id.name : "Non definie"}</span>
                        </div>
                        {/* Icône pour la category */}
                        <div className="flex items-center gap-2">
                            <ChartColumnStacked size={20} className="text-green-600" />
                            <span>Categorie : {courseInfo?.course.category_id ? courseInfo.course.category_id.name : "Non definie"}</span>
                        </div>
                        {/* Icône pour le job */}
                        <div className="flex items-center gap-2">
                            <Briefcase size={20} className="text-yellow-500" />
                            <span>metier : {courseInfo?.course.job_id ? courseInfo.course.job_id.name : "non definie"}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Liste des leçons */}
            <div className="flex h-full">
                <div className="w-1/3 bg-white rounded-lg shadow p-4 overflow-auto">
                    <h2 className="text-xl font-bold mb-4">Leçons</h2>
                    {courseInfo?.lessons.map(lesson => (
                        <motion.div
                            key={lesson._id}
                            className={`cursor-pointer p-3 mb-2 rounded-lg ${selectedLesson === lesson._id ? "bg-purple-200" : "bg-gray-200"}`}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => {
                                setSelectedLesson(lesson._id);
                                setSelectedSection(lesson.sections[0]?._id || null);
                            }}
                        >
                            {lesson.title}
                        </motion.div>
                    ))}
                </div>

                {/* Détails de la section */}
                <div className="w-2/3 bg-white rounded-lg shadow p-6 ml-4 flex flex-col items-center">
                    {currentSection ? (
                        <motion.div
                            key={currentSection._id}
                            className="w-full"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-xl font-bold mb-4">{currentSection.title}</h2>
                            {currentSection.path_image && (
                                <img
                                    src={currentSection.path_image}
                                    alt={currentSection.title}
                                    className="w-full h-64 object-cover rounded mb-4"
                                />
                            )}
                            <p>{currentSection.description}</p>
                        </motion.div>
                    ) : (
                        <p>Sélectionnez une leçon et une section pour les afficher</p>
                    )}

                    {/* Contrôles de navigation */}
                    <div className="flex gap-4 mt-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="p-2 bg-gray-300 rounded"
                            onClick={handlePrevSection}
                            disabled={!currentLesson || selectedSection === currentLesson.sections[0]?._id}
                            aria-disabled={!currentLesson || selectedSection === currentLesson.sections[0]?._id}
                        >
                            <ChevronLeft />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="p-2 bg-gray-300 rounded"
                            onClick={handleNextSection}
                            disabled={
                                !currentLesson || selectedSection === currentLesson.sections[currentLesson.sections.length - 1]?._id
                            }
                            aria-disabled={
                                !currentLesson || selectedSection === currentLesson.sections[currentLesson.sections.length - 1]?._id
                            }
                        >
                            <ChevronRight />
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewCourse;
