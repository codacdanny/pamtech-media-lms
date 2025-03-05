import { LoginRequest, LoginResponse, RegisterStudentRequest, RegisterStudentResponse } from "@/app/types/auth";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/api/v1/auth/login`,
      credentials
    );

    // Store user data
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  },

  async registerStudent(data: RegisterStudentRequest): Promise<RegisterStudentResponse> {
    const response = await axios.post<RegisterStudentResponse>(
      `${API_URL}/api/v1/auth/register`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },
};
