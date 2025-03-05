import axios from "axios";
import { StudentCoursesResponse } from "@/app/types/course";
import { CourseModule } from "@/app/types/module";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const studentService = {
  async getPaidCourses(): Promise<StudentCoursesResponse> {
    const token = localStorage.getItem("token");
    const response = await axios.get<StudentCoursesResponse>(
      `${API_URL}/api/v1/student/paid-courses`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  async getModules(courseId: string): Promise<CourseModule> {
    const token = localStorage.getItem("token");
    const response = await axios.get<CourseModule>(
      `${API_URL}/api/v1/student/courses/${courseId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(response.data);
    return response.data;
  },

  async getCourse(courseId: string): Promise<any> {
    const token = localStorage.getItem("token");
    const response = await axios.get<any>(
      `${API_URL}/api/v1/student/courses/${courseId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};
