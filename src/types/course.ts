// export type Course = {
//     _id: string;
//     title: string;
//     path_image?: string;
//     path_video?: string;
//     description?: string;
//     price?: Number;
//     isCertified: Boolean;
//     duration: string;
//     status: boolean;
//     created_by: object;
//     studyLevel_id?: object;
//     category_id?: object;
//     job_id?: object;
//     createdAt: string;
//     updatedAt: string;
// }

export interface Section {
    _id: string;
    title: string;
    description: string;
    lesson_id: string;
    path_image: string | null;
    path_video: string | null;
    type: string;
    order: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface Lesson {
    _id: string;
    title: string;
    description: string;
    duration: string;
    order: number;
    course_id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    sections: Section[];
  }
  
  export interface Course {
    _id: string;
    title: string;
    description: string;
    path_image: string;
    path_video: string | null;
    price: number;
    isCertified: boolean;
    duration: string;
    status: boolean;
    created_by: {
      _id: string;
      firstname: string;
      lastname: string;
      email: string;
    };
    studyLevel_id: {
      _id: string;
      name: string;
    };
    job_id: {
      _id: string;
      name: string;
    };
    category_id: {
      _id: string;
      name: string;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface CourseResponse {
    course: Course;
    lessons: Lesson[];
  }
  