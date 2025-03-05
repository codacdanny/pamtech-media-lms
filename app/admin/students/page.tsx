"use client";
import { useEffect, useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiLock,
  FiUnlock,
  FiX,
  FiBook,
} from "react-icons/fi";
import { Course } from "@/app/types/course";
import { Student } from "@/app/types/student";
import { courseService } from "@/app/utils/services/course";
import { authService } from "@/app/utils/services/auth";
import { adminService } from "@/app/utils/services/admin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ManageStudents() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    password: "",
    courses: [] as string[],
  });
  const [isDeletingStudent, setIsDeletingStudent] = useState<string | null>(
    null
  );

  const router = useRouter();
  // Fetch students when component mounts
  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }
      try {
        setIsLoading(true);
        const response = await adminService.getAllStudents();
        setStudents(response.students);
      } catch (error: any) {
        toast.error("Failed to fetch students");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Fetch courses when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await courseService.getAllCourses();
        setCourses(response.courses);
      } catch (error: any) {
        toast.error("Failed to fetch courses");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseSelection = (courseId: string) => {
    setNewStudent((prev) => ({
      ...prev,
      courses: prev.courses.includes(courseId)
        ? prev.courses.filter((id) => id !== courseId)
        : [...prev.courses, courseId],
    }));
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await authService.registerStudent({
        name: newStudent.name,
        email: newStudent.email,
        password: newStudent.password,
        paidCourses: newStudent.courses,
      });

      // Add new student to the list
      setStudents((prev) => [
        ...prev,
        {
          _id: response.user._id,
          name: response.user.name,
          email: response.user.email,
          role: "student",
          status: "active",
          paidCourses: response.user.paidCourses,
          createdAt: response.user.createdAt,
          updatedAt: response.user.updatedAt,
        },
      ]);

      toast.success("Student registered successfully");
      setShowAddModal(false);

      // Reset form
      setNewStudent({
        name: "",
        email: "",
        password: "",
        courses: [],
      });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to register student"
      );
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      setIsDeletingStudent(studentId);
      await adminService.deleteStudent(studentId);

      // Remove student from the list
      setStudents((prev) =>
        prev.filter((student) => student._id !== studentId)
      );

      toast.success("Student deleted successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete student");
      console.error("Delete student error:", error);
    } finally {
      setIsDeletingStudent(null);
    }
  };

  // Add this new component to show courses in table
  const CourseBadge = ({ courses }: { courses: string[] | Course[] }) => {
    if (!courses || courses.length === 0)
      return <span className="text-gray-400">No courses</span>;

    return (
      <div className="flex items-center space-x-1">
        <FiBook className="text-[#307BE9]" />
        <span className="text-sm text-gray-500">{courses.length} courses</span>
        <div className="group relative">
          <button className="text-xs text-[#307BE9] hover:underline">
            View
          </button>
          <div className="absolute left-0 top-full mt-2 w-64 bg-white shadow-lg rounded-lg p-3 hidden group-hover:block z-10">
            <div className="text-sm space-y-2">
              {Array.isArray(courses) &&
                courses.length > 0 &&
                courses.map((course, index) => (
                  <div
                    key={
                      typeof course === "string" ? course : course._id || index
                    }
                    className="border-b pb-2 last:border-0"
                  >
                    {typeof course === "string" ? (
                      <p className="font-medium">Course ID: {course}</p>
                    ) : (
                      <>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-xs text-gray-500">
                          {course.description}
                        </p>
                      </>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Actions Bar */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Student Management
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#307BE9] text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors text-sm sm:text-base"
        >
          <FiPlus className="mr-2" />
          Add New Student
        </button>
      </div>

      {/* Updated Students Table - with responsive handling and horizontal scrolling */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {student.name}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {student.email}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <CourseBadge courses={student.paidCourses} />
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteStudent(student._id)}
                        disabled={isDeletingStudent === student._id}
                        className={`text-red-500 hover:text-red-700 ${
                          isDeletingStudent === student._id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {isDeletingStudent === student._id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-500" />
                        ) : (
                          <FiTrash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal - make it responsive */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-y-auto p-4 z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Add New Student
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Student Details Section */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="font-semibold text-gray-700">
                    Student Information
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      value={newStudent.name}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, name: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border text-gray-700 border-gray-300 px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newStudent.email}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, email: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border text-gray-700 border-gray-300 px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="text"
                      value={newStudent.password}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          password: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border text-gray-700 border-gray-300 px-3 py-2 text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Course Selection Section */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="font-semibold text-gray-700">
                    Available Courses
                  </h3>
                  <div className="space-y-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto border rounded-md p-3 sm:p-4">
                    {courses.map((course) => (
                      <div
                        key={course._id}
                        className="border-b last:border-b-0 pb-3 mb-3"
                      >
                        <label className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={newStudent.courses.includes(course._id)}
                            onChange={() => handleCourseSelection(course._id)}
                            className="mt-1 rounded border-gray-300 text-[#307BE9] focus:ring-[#307BE9]"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 text-sm">
                              {course.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {course.description}
                            </p>
                            <div className="mt-2">
                              <div className="text-xs text-gray-500">
                                {course.modules.length} modules • Start date:{" "}
                                {new Date(
                                  course.startDate
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                  {/* Selected Courses Summary */}
                  <div className="text-sm text-gray-600">
                    Selected: {newStudent.courses.length} courses
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 sm:px-4 sm:py-2 text-gray-600 hover:text-gray-800 text-sm"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#307BE9] hover:bg-blue-600"
                  } text-white`}
                >
                  {isSubmitting ? "Registering..." : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow">
            Loading Students...
          </div>
        </div>
      )}
    </div>
  );
}
