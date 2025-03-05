export interface CourseVideo {
  _id: string;
  title: string;
  videoUrl: string;
  publicId: string;
}

export interface CourseModule {
  _id: string;
  title: string;
  day: number;
  videos: CourseVideo[];
}

export interface ModulesResponse {
  modules: CourseModule[];
}
