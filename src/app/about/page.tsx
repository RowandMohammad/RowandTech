import Link from "next/link";
import Image from "next/image";
import {
  Github,
  Linkedin,
  ExternalLink,
  Mail,
  Award,
  Briefcase,
  Code,
} from "lucide-react";

export const metadata = {
  title: "About | RowandTech",
  description:
    "Learn more about Rowand Mohammad, Solutions Engineer and ML specialist",
};

export default function AboutPage() {
  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-3">
              Meet the Author
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About Rowand
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Solutions Engineer and Machine Learning specialist with a passion
              for innovative tech solutions
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-12 mb-16">
            {/* Profile Image */}
            <div className="md:w-1/3 flex justify-center">
              <div className="w-64 h-64 rounded-full overflow-hidden shadow-xl border-4 border-white ring-2 ring-blue-100">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-6xl font-bold">
                  RM
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Briefcase className="mr-2 text-blue-600" size={22} />
                Professional Background
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                As a Solutions Engineer at ProtoPie, I specialize in bridging
                hardware and software integrations, setting up enterprise
                environments, and implementing AI/data engineering solutions. My
                expertise spans Docker, Kubernetes, AWS, and various programming
                languages including Java, Python, JavaScript, and TypeScript.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 flex items-center">
                <Award className="mr-2 text-blue-600" size={22} />
                Education
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                I completed my MSc in Machine Learning at Royal Holloway,
                University of London with Distinction in 2025. My specialization
                focused on integrating hardware systems (Raspberry Pi, Arduino)
                with sophisticated AI/ML solutions for practical, real-world
                applications.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 flex items-center">
                <Code className="mr-2 text-blue-600" size={22} />
                Technical Focus
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                My work centers around creating seamless integrations between
                hardware and AI systems, developing enterprise-grade solutions,
                and optimizing data pipelines. I'm particularly interested in AI
                applications for IoT devices and edge computing solutions.
              </p>

              {/* Social Links */}
              <div className="flex mt-8 space-x-5">
                <Link
                  href="https://github.com/rowandmohammad"
                  target="_blank"
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Github className="mr-2" size={20} />
                  <span>GitHub</span>
                </Link>
                <Link
                  href="https://linkedin.com/in/rowandmohammad"
                  target="_blank"
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Linkedin className="mr-2" size={20} />
                  <span>LinkedIn</span>
                </Link>
                <Link
                  href="https://rowandsmohammad.com"
                  target="_blank"
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="mr-2" size={20} />
                  <span>Website</span>
                </Link>
                <Link
                  href="mailto:contact@rowandsmohammad.com"
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Mail className="mr-2" size={20} />
                  <span>Email</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Technical Expertise
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Docker", category: "devops" },
                { name: "Kubernetes", category: "devops" },
                { name: "AWS", category: "cloud" },
                { name: "Azure", category: "cloud" },
                { name: "Java", category: "language" },
                { name: "Python", category: "language" },
                { name: "JavaScript", category: "language" },
                { name: "TypeScript", category: "language" },
                { name: "Machine Learning", category: "ai" },
                { name: "Data Engineering", category: "data" },
                { name: "Enterprise Solutions", category: "business" },
                { name: "Security", category: "devops" },
                { name: "Networking", category: "infrastructure" },
                { name: "Raspberry Pi", category: "hardware" },
                { name: "Arduino", category: "hardware" },
                { name: "CI/CD", category: "devops" },
                { name: "Cloud Architecture", category: "cloud" },
                { name: "RESTful APIs", category: "development" },
                { name: "GraphQL", category: "development" },
                { name: "React", category: "frontend" },
              ].map((skill) => (
                <div
                  key={skill.name}
                  className={`rounded-lg p-3 text-center shadow-sm hover:shadow-md transition-all ${
                    skill.category === "ai" || skill.category === "data"
                      ? "bg-blue-50 text-blue-800"
                      : skill.category === "devops" ||
                        skill.category === "cloud"
                      ? "bg-indigo-50 text-indigo-800"
                      : skill.category === "language" ||
                        skill.category === "development"
                      ? "bg-purple-50 text-purple-800"
                      : skill.category === "hardware"
                      ? "bg-green-50 text-green-800"
                      : "bg-gray-50 text-gray-800"
                  }`}
                >
                  {skill.name}
                </div>
              ))}
            </div>
          </div>

          {/* Blog Purpose */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-16 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why This Blog Exists
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              I created RowandTech to share my expertise, best practices, and
              in-depth breakdowns of solutions engineering challenges. My goal
              is to help others learn and build better systems while documenting
              my own projects and insights. This platform serves as both a
              professional portfolio and a valuable resource for the tech
              community.
            </p>
          </div>

          {/* Projects Highlight */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  Edge AI Implementation
                </h3>
                <p className="text-gray-600 mb-4">
                  Deployed machine learning models on edge devices for real-time
                  inference without cloud dependency.
                </p>
                <Link
                  href="/projects"
                  className="text-blue-600 font-medium hover:text-blue-800 inline-flex items-center group"
                >
                  View Details
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  Enterprise Data Pipeline
                </h3>
                <p className="text-gray-600 mb-4">
                  Built scalable data processing workflows for Fortune 500
                  company using AWS and Kubernetes.
                </p>
                <Link
                  href="/projects"
                  className="text-blue-600 font-medium hover:text-blue-800 inline-flex items-center group"
                >
                  View Details
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-8 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">
              Let&apos;s Connect
            </h2>
            <p className="text-blue-100 mb-6">
              Have questions about my work or interested in collaboration? I'm
              always open to discussing new projects and opportunities.
            </p>
            <Link
              href="mailto:contact@rowandsmohammad.com"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-blue-700 bg-white hover:bg-blue-50 transition-colors shadow-sm"
            >
              <Mail className="mr-2" size={18} />
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
