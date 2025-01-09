interface Enrollment {
    _id: string;
    user_id: {
      _id: string;
      firstname: string;
      lastname: string;
      username: string;
      email: string;
      role: string;
      dateOfBirth: string;
      phone: string;
      address: string;
      studyLevel: string;
      status: boolean;
    };
    course_id: {
      _id: string;
      title: string;
      description: string;
      path_image: string;
      path_video: string;
      price: number;
      isCertified: boolean;
      created_by: string;
      studyLevel_id: string;
      job_id: string;
      category_id: string;
      createdAt: string;
      updatedAt: string;
      status: boolean;
      duration: string;
    };
    start_date: string;
    status: string;
    completion_date: string | null;
    isPayed: boolean;
    createdAt: string;
    updatedAt: string;
  }
  