import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-3.5 py-2.5 rounded-[15px] text-sm font-medium transition duration-200 ease-in ${
      isActive
        ? "bg-indigo-100 text-indigo-500"
        : "text-gray-500 hover:text-black hover:bg-gray-200"
    }`;

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 relative flex items-center">
        
        {/* LEFT: Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500 text-white flex items-center justify-center">
            📄
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

        {/* CENTER: Navigation */}
        <div className="absolute left-1/2 -translate-x-1/2 flex gap-2">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/analyze" className={linkClass}>Analyze</NavLink>
          <NavLink to="/rank" className={linkClass}>Rank</NavLink>
          <NavLink to="/generate" className={linkClass}>Generate Resume</NavLink>
        </div>

        {/* RIGHT: Badge */}
        <div className="ml-auto">
          <span className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-500 text-sm font-medium">
            ✨ AI Powered
          </span>
        </div>

      </div>
    </nav>
  );
}
