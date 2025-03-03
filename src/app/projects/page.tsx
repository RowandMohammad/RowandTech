import Link from "next/link";
import { Github, ExternalLink, Clock, Tag, Layers } from "lucide-react";

export const metadata = {
  title: "Projects | RowandTech",
  description: "Explore my technical projects and professional portfolio",
};

// Sample projects data
const projects = [
  {
    id: 1,
    title: "ML-Powered IoT Monitoring System",
    description:
      "A Raspberry Pi-based system that uses machine learning to detect anomalies in sensor data from IoT devices. Built with Python, TensorFlow, and MQTT.",
    tags: ["Python", "TensorFlow", "Raspberry Pi", "MQTT", "IoT"],
    githubUrl: "https://github.com/rowandmohammad/ml-iot-monitor",
    demoUrl: "",
    imageUrl: "",
    year: "2024",
    category: "AI & IoT",
  },
  {
    id: 2,
    title: "Kubernetes Deployment Visualizer",
    description:
      "A web application that provides a visual representation of Kubernetes deployments, services, and pods. Built with React, TypeScript, and the Kubernetes API.",
    tags: ["TypeScript", "React", "Kubernetes", "Docker", "D3.js"],
    githubUrl: "https://github.com/rowandmohammad/k8s-visualizer",
    demoUrl: "https://k8s-viz.rowandsmohammad.com",
    imageUrl: "",
    year: "2024",
    category: "DevOps",
  },
  {
    id: 3,
    title: "Enterprise Security Scanner",
    description:
      "A tool for scanning enterprise environments for security vulnerabilities and compliance issues. Integrates with various cloud providers and on-premise systems.",
    tags: ["Java", "Spring Boot", "AWS", "Security", "DevSecOps"],
    githubUrl: "https://github.com/rowandmohammad/security-scanner",
    demoUrl: "",
    imageUrl: "",
    year: "2023",
    category: "Security",
  },
  {
    id: 4,
    title: "Data Pipeline Framework",
    description:
      "A modular framework for building scalable data pipelines with built-in monitoring, error handling, and retry mechanisms. Supports both batch and streaming data.",
    tags: ["Python", "Apache Airflow", "Kafka", "Docker", "ETL"],
    githubUrl: "https://github.com/rowandmohammad/data-pipeline-framework",
    demoUrl: "",
    imageUrl: "",
    year: "2023",
    category: "Data Engineering",
  },
  {
    id: 5,
    title: "Hardware-Accelerated ML Inference",
    description:
      "A system for deploying machine learning models on edge devices with hardware acceleration. Optimized for Raspberry Pi with Coral TPU.",
    tags: ["Python", "TensorFlow Lite", "C++", "Raspberry Pi", "Edge AI"],
    githubUrl: "https://github.com/rowandmohammad/edge-ml-accelerator",
    demoUrl: "",
    imageUrl: "",
    year: "2023",
    category: "AI & IoT",
  },
  {
    id: 6,
    title: "Cloud Cost Optimizer",
    description:
      "A tool that analyzes cloud resource usage and provides recommendations for cost optimization. Supports AWS, Azure, and GCP.",
    tags: ["Python", "AWS", "Azure", "GCP", "Cloud"],
    githubUrl: "https://github.com/rowandmohammad/cloud-cost-optimizer",
    demoUrl: "https://cost-optimizer.rowandsmohammad.com",
    imageUrl: "",
    year: "2022",
    category: "Cloud",
  },
];

// Get unique categories
const categories = Array.from(
  new Set(projects.map((project) => project.category))
);

export default function ProjectsPage() {
  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-3">
              Professional Portfolio
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Technical Projects
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              A showcase of my professional work in AI, data engineering,
              hardware integration, and enterprise solutions.
            </p>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center mb-12 gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden flex flex-col h-full hover:-translate-y-1 duration-300"
              >
                {/* Project Image or Colored Header */}
                <div
                  className={`h-8 ${
                    project.category === "AI & IoT"
                      ? "bg-blue-500"
                      : project.category === "DevOps"
                      ? "bg-indigo-500"
                      : project.category === "Data Engineering"
                      ? "bg-purple-500"
                      : project.category === "Security"
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                ></div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center mb-3 text-sm text-gray-500">
                    <Clock size={14} className="mr-1" />
                    <span className="mr-3">{project.year}</span>
                    <Tag size={14} className="mr-1" />
                    <span>{project.category}</span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    {project.title}
                  </h2>
                  <p className="text-gray-600 mb-4 flex-grow">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-gray-50 text-gray-700 text-xs px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <Github className="mr-1.5" size={16} />
                      <span>Source Code</span>
                    </Link>
                    {project.demoUrl ? (
                      <Link
                        href={project.demoUrl}
                        target="_blank"
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="ml-1.5" size={16} />
                      </Link>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Private Project
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Project Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-700 mb-2">15+</div>
              <div className="text-gray-700">Total Projects</div>
            </div>
            <div className="bg-indigo-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-indigo-700 mb-2">5+</div>
              <div className="text-gray-700">Years Experience</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-700 mb-2">8+</div>
              <div className="text-gray-700">Enterprise Solutions</div>
            </div>
            <div className="bg-green-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-700 mb-2">10+</div>
              <div className="text-gray-700">Technologies</div>
            </div>
          </div>

          {/* GitHub CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-center shadow-md">
            <h2 className="text-2xl font-bold text-white mb-4">
              Explore More on GitHub
            </h2>
            <p className="text-blue-100 mb-6">
              Discover additional projects, contributions to open-source, and my
              coding journey on GitHub.
            </p>
            <Link
              href="https://github.com/rowandmohammad"
              target="_blank"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-white text-blue-700 hover:bg-blue-50 transition-colors shadow-sm"
            >
              <Github className="mr-2" size={20} />
              <span>Visit GitHub Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
