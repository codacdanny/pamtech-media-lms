"use client";
import { useEffect, useState, useRef } from "react";
import {
  FiPlus,
  FiTrash2,
  FiEdit,
  FiUpload,
  FiFile,
  FiClock,
  FiBook,
  FiCalendar,
  FiPlayCircle,
} from "react-icons/fi";
import { Course } from "@/app/types/course";
import { adminService } from "@/app/utils/services/admin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ManageCourses() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState<string | null>(null);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAddingModule, setIsAddingModule] = useState(false);

  const router = useRouter();
  // Refs for file inputs
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const materialsInputRef = useRef<HTMLInputElement>(null);
  const moduleVideoRef = useRef<HTMLInputElement>(null);
  const moduleMaterialsRef = useRef<HTMLInputElement>(null);

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    startDate: "",
    duration: "",
    thumbnail: null as File | null,
    thumbnailName: "",
    materials: [] as File[],
    materialNames: [] as string[],
  });

  const [newModule, setNewModule] = useState({
    title: "",
    description: "",
    video: null as File | null,
    videoName: "",
    materials: [] as File[],
    materialNames: [] as string[],
  });

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }
      try {
        setIsLoading(true);
        const response = await adminService.getAllCourses();
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewCourse((prev) => ({
        ...prev,
        thumbnail: file,
        thumbnailName: file.name,
      }));
    }
  };

  const handleMaterialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewCourse((prev) => ({
        ...prev,
        materials: [...prev.materials, ...filesArray],
        materialNames: [
          ...prev.materialNames,
          ...filesArray.map((file) => file.name),
        ],
      }));
    }
  };

  const removeMaterial = (index: number) => {
    setNewCourse((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
      materialNames: prev.materialNames.filter((_, i) => i !== index),
    }));
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCourse.thumbnail) {
      toast.error("Please upload a thumbnail image");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("title", newCourse.title);
      formData.append("description", newCourse.description);
      formData.append("startDate", newCourse.startDate);
      formData.append("duration", newCourse.duration);

      if (newCourse.thumbnail) {
        formData.append("thumbnail", newCourse.thumbnail);
      }

      newCourse.materials.forEach((material) => {
        formData.append("materials", material);
      });

      const response = await adminService.createCourse(formData);

      // Add the new course to the state
      setCourses((prev) => [...prev, response.course]);

      toast.success(response.message);

      // Reset form and close modal
      setNewCourse({
        title: "",
        description: "",
        startDate: "",
        duration: "",
        thumbnail: null,
        thumbnailName: "",
        materials: [],
        materialNames: [],
      });

      setShowAddModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create course");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const response = await adminService.deleteCourse(courseId);
      setCourses((prev) => prev.filter((course) => course._id !== courseId));
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete course");
    } finally {
      setDeletingCourse(null);
    }
  };

  const getTotalVideos = (course: Course) => {
    return course.modules.reduce(
      (total, module) => total + module.videos.length,
      0
    );
  };

  const handleModuleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewModule((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewModule((prev) => ({
        ...prev,
        video: file,
        videoName: file.name,
      }));
    }
  };

  const handleModuleMaterialsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewModule((prev) => ({
        ...prev,
        materials: [...prev.materials, ...filesArray],
        materialNames: [
          ...prev.materialNames,
          ...filesArray.map((file) => file.name),
        ],
      }));
    }
  };

  const removeModuleMaterial = (index: number) => {
    setNewModule((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
      materialNames: prev.materialNames.filter((_, i) => i !== index),
    }));
  };

  const openModuleModal = (course: Course) => {
    setSelectedCourse(course);
    setShowModuleModal(true);
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourse) return;
    if (!newModule.video) {
      toast.error("Please upload a video");
      return;
    }

    try {
      setIsAddingModule(true);

      const formData = new FormData();
      formData.append("title", newModule.title);
      formData.append("description", newModule.description);

      if (newModule.video) {
        formData.append("video", newModule.video);
      }

      newModule.materials.forEach((material) => {
        formData.append("materials", material);
      });

      const response = await adminService.addModuleToCourse(
        selectedCourse._id,
        formData
      );

      // Update the course in the state
      setCourses((prev) =>
        prev.map((course) =>
          course._id === selectedCourse._id
            ? { ...course, modules: [...course.modules, response.module] }
            : course
        )
      );

      toast.success(response.message);

      // Reset form and close modal
      setNewModule({
        title: "",
        description: "",
        video: null,
        videoName: "",
        materials: [],
        materialNames: [],
      });

      setShowModuleModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add module");
      console.error(error);
    } finally {
      setIsAddingModule(false);
    }
  };

  return (
    <div>
      {/* Actions Bar */}
      <div className="mb-6 flex justify-between items-center ">
        <h1 className="text-2xl font-bold text-gray-800">Course Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#307BE9] text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors"
        >
          <FiPlus className="mr-2" />
          Add New Course
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-video bg-gray-100 relative">
              {course.thumbnailUrl ? (
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FiFile className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{course.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {course.modules.map((module) => (
                  <span
                    key={module._id}
                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                  >
                    {module.title}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <FiClock className="w-4 h-4" />
                  <span>{new Date(course.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiBook className="w-4 h-4" />
                  <span>{course.modules.length} modules</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>{getTotalVideos(course)} videos</span>
                </div>
              </div>

              {course.materials && course.materials.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Materials:
                  </p>
                  <div className="space-y-1">
                    {course.materials.map((material) => (
                      <a
                        key={material._id}
                        href={material.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center space-x-1"
                      >
                        <FiFile className="w-4 h-4" />
                        <span>{material.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-end space-x-2 p-4 border-t">
                <button
                  onClick={() => openModuleModal(course)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                >
                  <FiPlus className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setDeletingCourse(course._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Course</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this course? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeletingCourse(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  deletingCourse && handleDeleteCourse(deletingCourse)
                }
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow">
            Loading courses...
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Course</h2>
            <form onSubmit={handleAddCourse}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newCourse.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newCourse.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="startDate"
                        value={newCourse.startDate}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Duration (HH:MM:SS)
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiClock className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="duration"
                        value={newCourse.duration}
                        onChange={handleInputChange}
                        placeholder="00:30:00"
                        pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thumbnail
                  </label>
                  <div
                    className="mt-1 flex justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => thumbnailInputRef.current?.click()}
                  >
                    <div className="text-center">
                      {newCourse.thumbnail ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={URL.createObjectURL(newCourse.thumbnail)}
                            alt="Thumbnail preview"
                            className="w-32 h-32 object-cover mb-2"
                          />
                          <p className="text-sm text-gray-600">
                            {newCourse.thumbnailName}
                          </p>
                        </div>
                      ) : (
                        <>
                          <FiUpload className="mx-auto w-12 h-12 text-gray-400" />
                          <p className="mt-1 text-sm text-gray-600">
                            Click to upload or drag and drop
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Course Materials
                  </label>
                  <div
                    className="mt-1 flex justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => materialsInputRef.current?.click()}
                  >
                    <div className="text-center">
                      <FiFile className="mx-auto w-12 h-12 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-600">
                        Upload PDF materials
                      </p>
                    </div>
                    <input
                      ref={materialsInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      multiple
                      onChange={handleMaterialsChange}
                    />
                  </div>

                  {newCourse.materialNames.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Selected materials:
                      </p>
                      <ul className="space-y-1">
                        {newCourse.materialNames.map((name, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
                          >
                            <span className="flex items-center">
                              <FiFile className="mr-2 text-gray-500" />
                              {name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeMaterial(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiTrash2 />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#307BE9] text-white rounded-lg hover:bg-blue-600 flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>Add Course</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Module Modal */}
      {showModuleModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Add Module to {selectedCourse.title}
            </h2>
            <form onSubmit={handleAddModule}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Module Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newModule.title}
                    onChange={handleModuleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newModule.description}
                    onChange={handleModuleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Video
                  </label>
                  <div
                    className="mt-1 flex justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => moduleVideoRef.current?.click()}
                  >
                    <div className="text-center">
                      {newModule.video ? (
                        <div className="flex flex-col items-center">
                          <FiPlayCircle className="w-12 h-12 text-green-500" />
                          <p className="mt-1 text-sm text-gray-600">
                            {newModule.videoName}
                          </p>
                        </div>
                      ) : (
                        <>
                          <FiUpload className="mx-auto w-12 h-12 text-gray-400" />
                          <p className="mt-1 text-sm text-gray-600">
                            Upload video file
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      ref={moduleVideoRef}
                      type="file"
                      className="hidden"
                      accept="video/*"
                      onChange={handleVideoChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Module Materials (Optional)
                  </label>
                  <div
                    className="mt-1 flex justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => moduleMaterialsRef.current?.click()}
                  >
                    <div className="text-center">
                      <FiFile className="mx-auto w-12 h-12 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-600">
                        Upload PDF materials
                      </p>
                    </div>
                    <input
                      ref={moduleMaterialsRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      multiple
                      onChange={handleModuleMaterialsChange}
                    />
                  </div>

                  {newModule.materialNames.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Selected materials:
                      </p>
                      <ul className="space-y-1">
                        {newModule.materialNames.map((name, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
                          >
                            <span className="flex items-center">
                              <FiFile className="mr-2 text-gray-500" />
                              {name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeModuleMaterial(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiTrash2 />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModuleModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={isAddingModule}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#307BE9] text-white rounded-lg hover:bg-blue-600 flex items-center"
                  disabled={isAddingModule}
                >
                  {isAddingModule ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>Add Module</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
