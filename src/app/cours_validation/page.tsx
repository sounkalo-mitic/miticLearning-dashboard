"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Clock, Tag, BookOpen, User } from "lucide-react";
import { CourseResponse, Lesson, Section } from "@/types/course";
import { getCourseDetails } from "@/services/courseService";

// Définition des props
interface PreviewCourseProps {
    courseId: string; // Assurez-vous que cette propriété est correctement typée.
}

const PreviewCourse: React.FC<PreviewCourseProps> = ({ courseId }) => {
    const [courseInfo, setCourseInfo] = useState<CourseResponse | null>(null);
    const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);
    const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCourseDetails(courseId);
                if (data && data.lessons.length > 0) {
                    setCourseInfo(data);
                    setSelectedLessonIndex(0);
                    setSelectedSectionIndex(0);
                }
            } catch (error) {
                console.error("Erreur lors du chargement du cours :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId]);

    if (loading) return <p>Chargement...</p>;

    if (!courseInfo) return <p>Aucun cours trouvé</p>;

    const lessons = courseInfo.lessons || [];
    const currentLesson: Lesson | undefined = lessons[selectedLessonIndex];
    const sections = currentLesson?.sections || [];
    const currentSection: Section | undefined = sections[selectedSectionIndex];

    const handleNextSection = () => {
        if (selectedSectionIndex < sections.length - 1) {
            setSelectedSectionIndex(selectedSectionIndex + 1);
        }
    };

    const handlePrevSection = () => {
        if (selectedSectionIndex > 0) {
            setSelectedSectionIndex(selectedSectionIndex - 1);
        }
    };

    return (
        <div className="flex flex-col h-screen p-6 bg-gray-100">
            {/* Informations principales */}
            <motion.div
                className="bg-white rounded-lg shadow p-6 flex gap-6 items-start mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {courseInfo.course.path_image && (
                    <Image
                        src={`http://localhost:4444${courseInfo.course.path_image}`}
                        alt="Image du cours"
                        width={160}
                        height={160}
                        priority
                        className="rounded object-cover"
                    />
                )}

                <div>
                    <h2 className="text-2xl font-bold mb-2">{courseInfo.course.title}</h2>
                    <p className="text-gray-600 mb-4">{courseInfo.course.description}</p>

                    <div className="flex items-center gap-4 text-gray-700 flex-wrap">
                        <div className="flex items-center gap-2">
                            <User size={20} className="text-purple-600" />
                            <span>{`Professeur : ${courseInfo.course.created_by.firstname} ${courseInfo.course.created_by.lastname}`}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BookOpen size={20} className="text-purple-600" />
                            <span>Nombre de leçons : {lessons.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={20} className="text-blue-600" />
                            <span>Durée : {courseInfo.course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tag size={20} className="text-green-600" />
                            <span>Prix : {courseInfo.course.price} FCFA</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Liste des leçons */}
            <div className="flex h-full">
                <div className="w-1/3 bg-white rounded-lg shadow p-4 overflow-auto">
                    <h2 className="text-xl font-bold mb-4">Leçons</h2>
                    {lessons.map((lesson, index) => (
                        <motion.div
                            key={lesson._id}
                            className={`cursor-pointer p-3 mb-2 rounded-lg ${selectedLessonIndex === index ? "bg-purple-200" : "bg-gray-200"
                                }`}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => {
                                setSelectedLessonIndex(index);
                                setSelectedSectionIndex(0);
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
                                <Image
                                    src={currentSection.path_image}
                                    alt={currentSection.title}
                                    width={600}
                                    height={256}
                                    className="rounded mb-4"
                                />
                            )}
                            <p>{currentSection.description.replace(/'/g, "&rsquo;")}</p>
                        </motion.div>
                    ) : (
                        <p>Sélectionnez une leçon et une section pour les afficher</p>
                    )}

                    {/* Contrôles de navigation */}
                    <div className="flex gap-4 mt-4">
                        <button
                            className="p-2 bg-gray-300 rounded"
                            onClick={handlePrevSection}
                            disabled={selectedSectionIndex === 0}
                        >
                            <ChevronLeft />
                        </button>
                        <button
                            className="p-2 bg-gray-300 rounded"
                            onClick={handleNextSection}
                            disabled={selectedSectionIndex >= sections.length - 1}
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewCourse;
