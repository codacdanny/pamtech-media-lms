import { useState } from "react";
import { FiUpload, FiFile, FiX } from "react-icons/fi";
import { adminService } from "@/app/utils/services/admin";
import { toast } from "react-toastify";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCourseModal({ onClose, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState({
    thumbnail: null as File | null,
    materials: [] as File[],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Add materials files
    files.materials.forEach((file) => {
      formData.append("materials", file);
    });

    try {
      setIsSubmitting(true);
      const response = await adminService.createCourse(formData);
      toast.success(response.message);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "thumbnail" | "materials"
  ) => {
    const fileList = e.target.files;
    if (!fileList) return;

    if (type === "thumbnail") {
      setFiles((prev) => ({ ...prev, thumbnail: fileList[0] }));
    } else {
      setFiles((prev) => ({
        ...prev,
        materials: [...prev.materials, ...Array.from(fileList)],
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Course</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                name="title"
                type="text"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                name="startDate"
                type="date"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration
              </label>
              <input
                name="duration"
                type="text"
                placeholder="00:30:00"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Thumbnail
              </label>
              <div className="mt-1 flex justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <FiUpload className="mx-auto w-12 h-12 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-600">
                    Click to upload thumbnail
                  </p>
                  <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "thumbnail")}
                    className="hidden"
                  />
                </div>
              </div>
              {files.thumbnail && (
                <p className="mt-2 text-sm text-green-600">
                  Selected: {files.thumbnail.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Course Materials
              </label>
              <div className="mt-1 flex justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <FiFile className="mx-auto w-12 h-12 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-600">
                    Upload PDF materials
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={(e) => handleFileChange(e, "materials")}
                    className="hidden"
                  />
                </div>
              </div>
              {files.materials.length > 0 && (
                <div className="mt-2 text-sm text-green-600">
                  Selected files:{" "}
                  {files.materials.map((f) => f.name).join(", ")}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isSubmitting}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg ${
                isSubmitting ? "bg-gray-400" : "bg-[#307BE9] hover:bg-blue-600"
              } text-white`}>
              {isSubmitting ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
