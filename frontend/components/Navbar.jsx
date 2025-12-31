import { NavLink } from "react-router-dom";
import { FileText, Sparkles, Brain } from "lucide-react";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-3.5 py-2.5 rounded-[14px] text-sm font-medium transition duration-200 ${
      isActive
        ? "bg-indigo-100 text-indigo-600"
        : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/60"
    }`;

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6 py-4 relative flex items-center">
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500 text-white flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>

          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              ResumeRanker
            </h1>
            <p className="text-xs text-gray-500">
              Intelligent Resume Analysis using NLP
            </p>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex gap-2">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/analyze" className={linkClass}>Analyze</NavLink>
          <NavLink to="/rank" className={linkClass}>Rank</NavLink>
          <NavLink to="/generate" className={linkClass}>Generate Resume</NavLink>
        </div>

        <div className="ml-auto">
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100/70 text-indigo-600 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI Powered
          </span>
        </div>

      </div>
    </nav>
  );
}
