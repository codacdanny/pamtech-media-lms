"use client";
import {
  useEffect,
  useState,
  useRef,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { studentService } from "@/app/utils/services/student";
import { toast } from "react-toastify";
import {
  FiPlay,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiMenu,
  FiX,
  FiBook,
  FiClock,
  FiDownload,
  FiArrowLeft,
  FiArrowRight,
  FiMaximize,
  FiMinimize,
  FiLock,
} from "react-icons/fi";
import { CourseModule, CourseVideo } from "@/app/types/module";

interface EnhancedVideo extends CourseVideo {
  materials: boolean;
  description: ReactNode;
  unlocked: any;
  duration?: string;
  isCompleted?: boolean;
}

interface EnhancedModule extends CourseModule {
  duration?: string;
  isCompleted?: boolean;
  videos: EnhancedVideo[];
}

export default function LearningArea() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [courseTitle, setCourseTitle] = useState("");
  const [modules, setModules] = useState<EnhancedModule[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<EnhancedVideo | null>(
    null
  );
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchCourse = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }
      try {
        setIsLoading(true);
        const response = await studentService.getCourse(courseId);
        console.log(response);

        setCourseTitle(response.course.title);

        // Transform the modules data
        const enhancedModules = response.course.modules.map(
          (module: { videos: any[] }) => ({
            ...module,
            duration: `${module.videos.length * 15}min`,
            isCompleted: false,
            videos: module.videos.map((video) => ({
              ...video,
              duration: "15:00",
              isCompleted: false,
            })),
          })
        );

        setModules(enhancedModules);

        if (
          enhancedModules.length > 0 &&
          enhancedModules[0].videos.length > 0
        ) {
          const firstUnlockedVideo = enhancedModules[0].videos.find(
            (v: { unlocked: any }) => v.unlocked
          );
          if (firstUnlockedVideo) {
            setSelectedVideo(firstUnlockedVideo);
            setExpandedModules([enhancedModules[0]._id]);

            // Find indices for navigation
            const moduleIndex = 0; // First module
            const videoIndex = enhancedModules[0].videos.findIndex(
              (v: { _id: any }) => v._id === firstUnlockedVideo._id
            );
            setCurrentModuleIndex(moduleIndex);
            setCurrentVideoIndex(videoIndex);
          }
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to fetch course");
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // const handleVideoCompletion = async () => {
  //   if (!selectedVideo) return;

  //   try {
  //     // Mark video as completed in the UI
  //     setModules((prevModules) =>
  //       prevModules.map((module) => ({
  //         ...module,
  //         videos: module.videos.map((video) =>
  //           video._id === selectedVideo._id
  //             ? { ...video, isCompleted: true }
  //             : video
  //         ),
  //       }))
  //     );

  //     // Update the selected video
  //     setSelectedVideo((prev) =>
  //       prev ? { ...prev, isCompleted: true } : null
  //     );

  //     // Call API to mark video as completed
  //     await studentService.markVideoAsCompleted(courseId, selectedVideo._id);

  //     // Check if module is completed
  //     const currentModule = modules[currentModuleIndex];
  //     const allVideosCompleted = currentModule.videos.every(
  //       (v) => v.isCompleted || v._id === selectedVideo._id
  //     );

  //     if (allVideosCompleted) {
  //       // Mark module as completed
  //       setModules((prevModules) =>
  //         prevModules.map((module, idx) =>
  //           idx === currentModuleIndex
  //             ? { ...module, isCompleted: true }
  //             : module
  //         )
  //       );
  //     }
  //   } catch (error: any) {
  //     toast.error("Failed to mark video as completed");
  //     console.error(error);
  //   }
  // };

  const navigateToNextVideo = () => {
    if (!modules.length) return;

    const currentModule = modules[currentModuleIndex];

    // If there are more videos in the current module
    if (currentVideoIndex < currentModule.videos.length - 1) {
      const nextVideo = currentModule.videos[currentVideoIndex + 1];
      if (nextVideo.unlocked) {
        setSelectedVideo(nextVideo);
        setCurrentVideoIndex(currentVideoIndex + 1);
      } else {
        toast.info("This video is locked. Complete previous videos first.");
      }
      return;
    }

    // If there are more modules
    if (currentModuleIndex < modules.length - 1) {
      const nextModule = modules[currentModuleIndex + 1];
      if (nextModule.videos.length > 0 && nextModule.videos[0].unlocked) {
        setSelectedVideo(nextModule.videos[0]);
        setCurrentModuleIndex(currentModuleIndex + 1);
        setCurrentVideoIndex(0);

        // Expand the next module
        if (!expandedModules.includes(nextModule._id)) {
          setExpandedModules([...expandedModules, nextModule._id]);
        }
      } else {
        toast.info("Next module is locked. Complete this module first.");
      }
    } else {
      toast.success("Congratulations! You've completed all available videos.");
    }
  };

  const navigateToPreviousVideo = () => {
    if (!modules.length) return;

    // If there are previous videos in the current module
    if (currentVideoIndex > 0) {
      const prevVideo =
        modules[currentModuleIndex].videos[currentVideoIndex - 1];
      setSelectedVideo(prevVideo);
      setCurrentVideoIndex(currentVideoIndex - 1);
      return;
    }

    // If there are previous modules
    if (currentModuleIndex > 0) {
      const prevModule = modules[currentModuleIndex - 1];
      if (prevModule.videos.length > 0) {
        const lastVideoIndex = prevModule.videos.length - 1;
        setSelectedVideo(prevModule.videos[lastVideoIndex]);
        setCurrentModuleIndex(currentModuleIndex - 1);
        setCurrentVideoIndex(lastVideoIndex);

        // Expand the previous module
        if (!expandedModules.includes(prevModule._id)) {
          setExpandedModules([...expandedModules, prevModule._id]);
        }
      }
    }
  };

  const toggleFullscreen = () => {
    const videoContainer = document.querySelector(".video-container");

    if (!videoContainer) return;

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch((err) => {
        toast.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const downloadMaterials = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#307BE9]"></div>
      </div>
    );
  }

  const totalDuration = modules.reduce(
    (total, module) => total + module.videos.length * 15,
    0
  );

  // Calculate progress based on completed videos
  const completedVideos = modules.reduce(
    (count, module) =>
      count + module.videos.filter((v) => v.isCompleted).length,
    0
  );

  const totalVideos = modules.reduce(
    (count, module) => count + module.videos.length,
    0
  );

  const totalProgress =
    totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

  const renderVideoButton = (
    video: EnhancedVideo,
    moduleIndex: number,
    videoIndex: number
  ) => (
    <button
      key={video._id}
      onClick={() => {
        if (video.unlocked) {
          setSelectedVideo(video);
          setCurrentModuleIndex(moduleIndex);
          setCurrentVideoIndex(videoIndex);
        }
      }}
      className={`w-full p-3 flex items-center space-x-3 rounded-lg transition-all duration-300 ${
        selectedVideo?._id === video._id
          ? "bg-gradient-to-r from-[#307BE9] to-blue-500 text-white shadow-md"
          : video.unlocked
          ? "hover:bg-blue-50"
          : "opacity-60 cursor-not-allowed"
      }`}
    >
      <div
        className={`w-6 h-6 rounded-full ${
          !video.unlocked
            ? "bg-gray-100"
            : selectedVideo?._id === video._id
            ? "bg-white/20"
            : video.isCompleted
            ? "bg-green-100"
            : "bg-blue-100"
        } flex items-center justify-center`}
      >
        {!video.unlocked ? (
          <FiLock className="w-4 h-4 text-gray-500" />
        ) : video.isCompleted ? (
          <FiCheck className="w-4 h-4 text-green-500" />
        ) : (
          <FiPlay
            className={`w-4 h-4 ${
              selectedVideo?._id === video._id ? "text-white" : "text-[#307BE9]"
            }`}
          />
        )}
      </div>
      <div className="text-left flex-1">
        <p
          className={`text-sm font-medium ${
            selectedVideo?._id === video._id
              ? "text-white"
              : video.unlocked
              ? "text-gray-800"
              : "text-gray-500"
          }`}
        >
          {video.title}
        </p>
        {video.unlocked && (
          <p
            className={`text-xs ${
              selectedVideo?._id === video._id
                ? "text-blue-100"
                : "text-gray-500"
            }`}
          >
            {video.duration}
          </p>
        )}
      </div>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div
        className={`${
          showSidebar ? "w-full md:w-80" : "w-0"
        } bg-white/80 backdrop-blur-xl shadow-lg transition-all duration-300 flex flex-col h-full border-r border-blue-100 ${
          showSidebar ? "block" : "hidden md:flex"
        }`}
      >
        <div className="p-4 md:p-6 border-b border-blue-100 bg-gradient-to-r from-[#307BE9]/10 to-purple-100 flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-[#307BE9] text-lg">{courseTitle}</h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="md:hidden text-gray-500 hover:text-[#307BE9]"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FiClock className="w-4 h-4 text-[#307BE9]" />
            <span>{totalDuration}m total length</span>
          </div>
          <div className="w-full bg-blue-100 h-2 rounded-full">
            <div
              className="bg-gradient-to-r from-[#307BE9] to-blue-400 h-2 rounded-full"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>

        {/* Modules List */}
        <div className="overflow-y-auto flex-1 py-4">
          {modules.map((module, moduleIndex) => (
            <div key={module._id} className="px-4 mb-4">
              <button
                onClick={() => toggleModule(module._id)}
                className="w-full p-4 flex items-center justify-between bg-white rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border border-blue-100"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-left">
                    <h3 className="font-medium text-gray-800">
                      {module.title}
                    </h3>
                    <p className="text-sm text-gray-500">Day {module.day}</p>
                  </div>
                </div>
                {expandedModules.includes(module._id) ? (
                  <FiChevronUp />
                ) : (
                  <FiChevronDown />
                )}
              </button>

              {/* Videos List */}
              {expandedModules.includes(module._id) && (
                <div className="mt-2 ml-4 space-y-1">
                  {module.videos.map((video, videoIndex) =>
                    renderVideoButton(video, moduleIndex, videoIndex)
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navigation */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-blue-100 px-4 md:px-6 py-4 flex items-center justify-between">
          {!showSidebar && (
            <button
              onClick={() => setShowSidebar(true)}
              className="mr-4 hover:text-[#307BE9]"
            >
              <FiMenu className="w-6 h-6" />
            </button>
          )}
          <div className="flex items-center space-x-4 overflow-hidden">
            <h1 className="text-lg md:text-xl font-bold text-gray-800 truncate">
              {selectedVideo?.title || courseTitle}
            </h1>
          </div>
          <button
            className="text-gray-500 hover:text-[#307BE9]"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <FiMinimize className="w-5 h-5" />
            ) : (
              <FiMaximize className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Video Section */}
          <div
            className={`bg-black video-container ${
              isFullscreen ? "h-screen" : "aspect-video"
            }`}
          >
            {selectedVideo ? (
              <video
                ref={videoRef}
                className="w-full h-full"
                controls
                src={selectedVideo.videoUrl}
                key={selectedVideo._id}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                Select a video to start learning
              </div>
            )}
          </div>

          {/* Content Section */}
          {selectedVideo && (
            <div className="p-4 md:p-8 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  {selectedVideo.title}
                </h2>

                <div className="flex space-x-2">
                  <button
                    onClick={navigateToPreviousVideo}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    title="Previous Video"
                  >
                    <FiArrowLeft className="w-5 h-5 text-gray-700" />
                  </button>

                  <button
                    onClick={navigateToNextVideo}
                    className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                    title="Next Video"
                  >
                    <FiArrowRight className="w-5 h-5 text-blue-700" />
                  </button>
                </div>
              </div>

              <div className="prose prose-blue max-w-none">
                <p className="text-gray-700">{selectedVideo.description}</p>
              </div>

              {/* Materials Section
              {selectedVideo.materials && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">
                    Course Materials
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedVideo.materials &&
                      selectedVideo.materials.map(
                        (
                          material: {
                            [x: string]: string;
                            title: string;
                          },
                          index: Key | null | undefined
                        ) => (
                          <div
                            key={index}
                            className="bg-white p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <FiBook className="w-6 h-6 text-blue-500" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800 mb-1 line-clamp-1">
                                  {material.title}
                                </h4>
                                <button
                                  onClick={() =>
                                    downloadMaterials(
                                      material.fileUrl,
                                      material.title
                                    )
                                  }
                                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                  <FiDownload className="w-4 h-4 mr-1" />{" "}
                                  Download
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                  </div>
                </div>
              )} */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
