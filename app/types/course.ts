export interface Video {
  title: string;
  videoUrl: string;
  publicId: string;
  _id?: string;
}

export interface Module {
  title: string;
  day: string | number;
  videos: Video[];
  _id?: string;
}

export interface Material {
  title: string;
  fileUrl: string;
  _id: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  thumbnailUrl?: string;
  materials: Material[];
  duration?: string;
  modules: Module[];
  createdAt: string;
  updatedAt: string;
}

export interface CoursesResponse {
  message: string;
  courses: Course[];
}

export interface CreateCourseResponse {
  message: string;
  course: Course;
}

export interface AddModuleResponse {
  module: any;
  message: string;
  course: Course;
}

export interface StudentCourse {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  duration: string;
  thumbnail: string;
}

export interface StudentCoursesResponse {
  message: string;
  courses: StudentCourse[];
}
