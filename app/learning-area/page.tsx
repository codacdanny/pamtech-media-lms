"use client";
import { useState } from "react";
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
} from "react-icons/fi";

interface Module {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  isCompleted: boolean;
}

const dummyModules: Module[] = [
  {
    id: "1",
    title: "Getting Started with Social Media Marketing",
    duration: "45min",
    isCompleted: false,
    lessons: [
      {
        id: "1-1",
        title: "Introduction to Social Media Marketing",
        duration: "15:00",
        videoUrl: "https://example.com/video1",
        isCompleted: true,
      },
      {
        id: "1-2",
        title: "Understanding Your Target Audience",
        duration: "30:00",
        videoUrl: "https://example.com/video2",
        isCompleted: false,
      },
    ],
  },
  // Add more modules as needed
];

export default function LearningArea() {
  const [selectedLesson, setSelectedLesson] = useState(
    dummyModules[0].lessons[0]
  );
  const [expandedModules, setExpandedModules] = useState<string[]>([
    dummyModules[0].id,
  ]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div
        className={`${
          showSidebar ? "w-80" : "w-0"
        } bg-white/80 backdrop-blur-xl shadow-lg transition-all duration-300 flex flex-col h-full border-r border-blue-100`}>
        <div className="p-6 border-b border-blue-100 bg-gradient-to-r from-[#307BE9]/10 to-purple-100 flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-[#307BE9] text-lg">Course Content</h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="lg:hidden text-gray-500 hover:text-[#307BE9]">
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FiClock className="w-4 h-4 text-[#307BE9]" />
            <span>6h 30m total length</span>
          </div>
          <div className="w-full bg-blue-100 h-2 rounded-full">
            <div
              className="bg-gradient-to-r from-[#307BE9] to-blue-400 h-2 rounded-full"
              style={{ width: "35%" }}
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 py-4">
          {dummyModules.map((module) => (
            <div key={module.id} className="px-4 mb-4">
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full p-4 flex items-center justify-between bg-white rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="text-left">
                    <h3 className="font-medium text-gray-800">
                      {module.title}
                    </h3>
                    <p className="text-sm text-gray-500">{module.duration}</p>
                  </div>
                </div>
                {expandedModules.includes(module.id) ? (
                  <FiChevronUp />
                ) : (
                  <FiChevronDown />
                )}
              </button>
              {expandedModules.includes(module.id) && (
                <div className="mt-2 ml-4 space-y-1">
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`w-full p-3 flex items-center space-x-3 rounded-lg transition-all duration-300 ${
                        selectedLesson.id === lesson.id
                          ? "bg-gradient-to-r from-[#307BE9] to-blue-500 text-white shadow-md"
                          : "hover:bg-blue-50"
                      }`}>
                      {lesson.isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <FiCheck className="text-green-500 w-4 h-4" />
                        </div>
                      ) : (
                        <div
                          className={`w-6 h-6 rounded-full ${
                            selectedLesson.id === lesson.id
                              ? "bg-white/20"
                              : "bg-blue-100"
                          } flex items-center justify-center`}>
                          <FiPlay
                            className={`w-4 h-4 ${
                              selectedLesson.id === lesson.id
                                ? "text-white"
                                : "text-[#307BE9]"
                            }`}
                          />
                        </div>
                      )}
                      <div className="text-left flex-1">
                        <p
                          className={`text-sm font-medium ${
                            selectedLesson.id === lesson.id
                              ? "text-white"
                              : "text-gray-800"
                          }`}>
                          {lesson.title}
                        </p>
                        <p
                          className={`text-xs ${
                            selectedLesson.id === lesson.id
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}>
                          {lesson.duration}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navigation */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-blue-100 px-6 py-4 flex items-center justify-between">
          {!showSidebar && (
            <button
              onClick={() => setShowSidebar(true)}
              className="mr-4 hover:text-[#307BE9]">
              <FiMenu className="w-6 h-6" />
            </button>
          )}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-800">
              {selectedLesson.title}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="text-gray-500 hover:text-[#307BE9]"
              onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? (
                <FiMinimize className="w-5 h-5" />
              ) : (
                <FiMaximize className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Video Section */}
          <div
            className={`bg-gradient-to-br from-gray-900 to-blue-900 ${
              isFullscreen ? "h-screen" : "aspect-video"
            }`}>
            <div className="relative h-full">
              {/* Replace with your video player component */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white">Video Player</span>
              </div>

              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    <button className="hover:text-[#307BE9]">
                      <FiPlay className="w-6 h-6" />
                    </button>
                    <span>00:00 / 15:00</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="hover:text-[#307BE9]">720p</button>
                    <button className="hover:text-[#307BE9]">1x</button>
                  </div>
                </div>
                <div className="mt-2 h-1 bg-white/30 rounded-full">
                  <div className="h-full w-1/3 bg-[#307BE9] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedLesson.title}
                </h2>
                <p className="text-[#307BE9]">
                  Lesson {selectedLesson.id} • {selectedLesson.duration}
                </p>
              </div>
              <div className="flex space-x-4">
                <button className="px-4 py-2 rounded-lg flex items-center space-x-2 text-gray-600 hover:bg-blue-50 transition-colors">
                  <FiArrowLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>
                <button className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-[#307BE9] text-white hover:bg-blue-600 transition-colors">
                  <span>Next</span>
                  <FiArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            {/* Resources Section */}
            <div className="mt-12">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Course Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FiBook className="w-6 h-6 text-[#307BE9]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">
                        Exercise Files
                      </h4>
                      <p className="text-sm text-[#307BE9]">PDF • 2.3 MB</p>
                    </div>
                    <button className="p-2 rounded-lg text-[#307BE9] hover:bg-blue-100 transition-colors">
                      <FiDownload className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
