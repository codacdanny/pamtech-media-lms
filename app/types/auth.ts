export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "student";
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// For future use
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export interface RegisterStudentRequest {
  name: string;
  email: string;
  password: string;
  paidCourses: string[];
}

export interface RegisterStudentResponse {
  message: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: "student";
    paidCourses: string[];
    createdAt: string;
    updatedAt: string;
  };
}
