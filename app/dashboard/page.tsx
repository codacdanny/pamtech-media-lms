"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FiSearch,
  FiClock,
  FiArrowUp,
  FiUsers,
  FiAward,
  FiTrendingUp,
} from "react-icons/fi";
import heroImage from "../../public/overlay.png";
import { StudentCourse } from "@/app/types/course";
import { studentService } from "@/app/utils/services/student";

export default function Dashboard() {
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const [selectedCategory, setSelectedCategory] = useState("all");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPaidCourses = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/");
          return;
        }

        const response = await studentService.getPaidCourses();
        setCourses(response.courses);
        toast.success(response.message);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to fetch your courses"
        );
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaidCourses();
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categories = [
    "All Courses",
    "Content Creation",
    "Social Media Marketing",
    "Personal Branding",
    "Instagram Growth",
    "TikTok Strategy",
  ];

  const stats = [
    { icon: FiUsers, count: "10K+", label: "Active Students" },
    { icon: FiAward, count: "50+", label: "Expert Instructors" },
    { icon: FiTrendingUp, count: "95%", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#307BE9]">Pamtech Media</h1>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-[#307BE9]">
              My Courses
            </button>
            <button className="text-gray-600 hover:text-[#307BE9]">
              Profile
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#307BE9] to-[#2563EB] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Master Social Media with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
                  Pamtech
                </span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Learn from industry experts and transform your social media
                presence
              </p>
              <div className="relative max-w-2xl">
                <input
                  type="text"
                  placeholder="Search for courses..."
                  className="w-full px-4 py-3 rounded-lg pl-12 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute left-4 top-3.5 text-gray-400 text-xl" />
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src={heroImage.src}
                alt="Social Media Success"
                className="rounded-lg shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <stat.icon className="w-12 h-12 text-[#307BE9] mr-4" />
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stat.count}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Courses Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Courses</h2>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#307BE9]"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              You haven't enrolled in any courses yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() => router.push(`/learning-area/${course._id}`)}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              >
                <div className="relative h-48">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    <div className="flex items-center space-x-2 text-white">
                      <FiClock />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {course.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiClock className="mr-2" />
                    <span>
                      Starts {new Date(course.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#307BE9] text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <FiArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
