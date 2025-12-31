import { Brain, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-14 text-center space-y-6">
        
        <div className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-900">
          <Brain className="w-5 h-5 text-indigo-600" />
          ResumeRanker
        </div>

        <p className="max-w-2xl mx-auto text-sm text-gray-600 leading-relaxed">
          An intelligent resume analysis and ATS optimization system built using
          Natural Language Processing and Machine Learning techniques.
        </p>

        <div>
          <span className="inline-block px-4 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600">
            Built with NLP & Machine Learning
          </span>
        </div>

        <p className="text-sm text-gray-600">
          Made with <span className="text-red-500">❤️</span> as an Academic Project
        </p>

        <div className="flex justify-center">
          <a
            href="https://github.com/punit1703/resumeranker"
            className="text-gray-400 hover:text-gray-700 transition"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>

        <p className="text-xs text-gray-400 pt-2">
          © 2025 ResumeRanker. For educational purposes only.
        </p>
      </div>
    </footer>
  );
}
