import axios from "axios";
import { StudentsResponse } from "@/app/types/student";
import {
  AddModuleResponse,
  CoursesResponse,
  CreateCourseResponse,
} from "@/app/types/course";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const adminService = {
  async getAllStudents(): Promise<StudentsResponse> {
    const token = localStorage.getItem("token");
    const response = await axios.get<StudentsResponse>(
      `${API_URL}/api/v1/admin/students`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  async getAllCourses(): Promise<CoursesResponse> {
    const token = localStorage.getItem("token");
    const response = await axios.get<CoursesResponse>(
      `${API_URL}/api/v1/admin/courses`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  async createCourse(formData: FormData): Promise<CreateCourseResponse> {
    const token = localStorage.getItem("token");
    const response = await axios.post<CreateCourseResponse>(
      `${API_URL}/api/v1/admin/courses/create`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  async addModuleToCourse(
    courseId: string,
    formData: FormData
  ): Promise<AddModuleResponse> {
    const token = localStorage.getItem("token");
    const response = await axios.post<AddModuleResponse>(
      `${API_URL}/api/v1/admin/courses/${courseId}/modules`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  async deleteCourse(courseId: string): Promise<{ message: string }> {
    const token = localStorage.getItem("token");
    const response = await axios.delete<{ message: string }>(
      `${API_URL}/api/v1/admin/courses/${courseId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  async deleteStudent(studentId: string): Promise<{ message: string }> {
    const token = localStorage.getItem("token");
    const response = await axios.delete<{ message: string }>(
      `${API_URL}/api/v1/admin/students/${studentId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};
