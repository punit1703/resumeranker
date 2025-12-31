import { NavLink } from "react-router-dom";
import { FileText, Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-indigo-100 text-indigo-600"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  const openSidebar = () => {
    setVisible(true);
    setTimeout(() => setOpen(true), 10);
  };

  const closeSidebar = () => {
    setOpen(false);
    setTimeout(() => setVisible(false), 280);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500 text-white flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                ResumeRanker
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Intelligent Resume Analysis using NLP
              </p>
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-2">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/analyze" className={linkClass}>Analyze</NavLink>
            <NavLink to="/rank" className={linkClass}>Rank</NavLink>
            <NavLink to="/generate" className={linkClass}>Generate</NavLink>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100/70 text-indigo-600 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI Powered
            </span>

            <button
              onClick={openSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </nav>

      {visible && (
        <div className="fixed inset-0 z-50">
          
          <div
            onClick={closeSidebar}
            className={`
              absolute inset-0 bg-black/40 backdrop-blur-sm
              transition-opacity duration-300
              ${open ? "opacity-100" : "opacity-0"}
            `}
          />

          <aside
            className={`
              absolute right-0 top-0 h-full w-80
              bg-white shadow-2xl rounded-l-3xl p-6
              flex flex-col
              transform transition-transform duration-300 ease-out
              ${open ? "translate-x-0" : "translate-x-full"}
            `}
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500 text-white flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">ResumeRanker</p>
                  <p className="text-xs text-gray-500">AI Resume Platform</p>
                </div>
              </div>

              <button
                onClick={closeSidebar}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <nav className="flex flex-col gap-2 text-sm font-medium">
              <NavLink onClick={closeSidebar} to="/" className={linkClass}>
                Home
              </NavLink>
              <NavLink onClick={closeSidebar} to="/analyze" className={linkClass}>
                Analyze Resume
              </NavLink>
              <NavLink onClick={closeSidebar} to="/rank" className={linkClass}>
                Rank Candidates
              </NavLink>
              <NavLink onClick={closeSidebar} to="/generate" className={linkClass}>
                Generate Resume
              </NavLink>
            </nav>

            <div className="flex-1" />

            <div className="pt-6 border-t">
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI Powered Platform
              </span>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
