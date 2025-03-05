import { Course } from "./course";

export interface Student {
  _id: string;
  name: string;
  email: string;
  role: "student";
  status: "active";
  paidCourses: string[] | Course[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentsResponse {
  message: string;
  students: Student[];
}
