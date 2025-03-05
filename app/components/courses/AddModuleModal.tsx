import { useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { adminService } from "@/app/utils/services/admin";
import { toast } from "react-toastify";

interface Props {
  courseId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddModuleModal({
  courseId,
  onClose,
  onSuccess,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Add all selected videos
    selectedVideos.forEach((video) => {
      formData.append("videos", video);
    });

    try {
      setIsSubmitting(true);
      const response = await adminService.addModuleToCourse(courseId, formData);
      toast.success(response.message);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add module");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Module</h2>
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
                Module Title
              </label>
              <input
                name="moduleTitle"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Day
              </label>
              <input
                name="day"
                type="number"
                min="1"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Videos
              </label>
              <div className="mt-1 flex justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <FiUpload className="mx-auto w-12 h-12 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-600">
                    Upload module videos
                  </p>
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setSelectedVideos(Array.from(e.target.files));
                      }
                    }}
                    className="hidden"
                  />
                </div>
              </div>
              {selectedVideos.length > 0 && (
                <div className="mt-2 text-sm text-green-600">
                  Selected videos:{" "}
                  {selectedVideos.map((v) => v.name).join(", ")}
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
              {isSubmitting ? "Adding..." : "Add Module"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
