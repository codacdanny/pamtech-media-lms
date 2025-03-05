import axios from "axios";
import { CoursesResponse } from "@/app/types/course";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const courseService = {
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
};
