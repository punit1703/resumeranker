import { NavLink, Link, useLocation } from "react-router-dom";
import { FileText, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../src/context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const { role, logout } = useAuth();
  const location = useLocation();

  // If there is no authenticated role AND the user is on the specific public pages, 
  // only show the text minimal version.
  const isPublicPage = location.pathname === "/" || location.pathname === "/role-select" || location.pathname === "/login";
  // UPDATE: Wait, the user said "there should not be the nav bar showen in the landing page the nav bar will be showen after login process"
  if (!role) {
    return null; 
  }


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
            {role === "candidate" && (
              <>
                <NavLink to="/analyze" className={linkClass}>
                  Analyze
                </NavLink>
                <NavLink to="/jobs" className={linkClass}>
                  Jobs
                </NavLink>
              </>
            )}

            {role === "company" && (
              <>
                <NavLink to="/employer/applications" className={linkClass}>
                  My Jobs
                </NavLink>
                <NavLink to="/create-job" className={linkClass}>
                  Post Job
                </NavLink>
                <NavLink to="/rank" className={linkClass}>
                  Rank
                </NavLink>
              </>
            )}
             {role === "candidate" && (
                <NavLink to="/generate" className={linkClass}>
                     Generate
                </NavLink>
             )}
          </div>

          <div className="ml-auto flex items-center gap-4">
             {!role ? (
              <NavLink
                to="/login"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Login
              </NavLink>
            ) : (
                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            )}

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
              {role === "candidate" && (
                <>
                  <NavLink onClick={closeSidebar} to="/analyze" className={linkClass}>
                    Analyze Resume
                  </NavLink>
                  <NavLink onClick={closeSidebar} to="/jobs" className={linkClass}>
                    Jobs
                  </NavLink>
                </>
              )}

              {role === "company" && (
                <>
                   <NavLink onClick={closeSidebar} to="/employer/applications" className={linkClass}>
                    My Jobs
                  </NavLink>
                   <NavLink onClick={closeSidebar} to="/create-job" className={linkClass}>
                    Post Job
                  </NavLink>
                  <NavLink onClick={closeSidebar} to="/rank" className={linkClass}>
                    Rank Candidates
                  </NavLink>
                </>
              )}

              {role === "candidate" && (
                <NavLink onClick={closeSidebar} to="/generate" className={linkClass}>
                  Generate Resume
                </NavLink>
              )}
              
              {!role ? (
                  <NavLink onClick={closeSidebar} to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-center mt-4">Login</NavLink>
              ): (
                  <button onClick={() => {logout(); closeSidebar();}} className="flex items-center gap-2 text-red-600 px-4 py-2 mt-4 hover:bg-red-50 rounded-lg w-full text-left">
                      <LogOut className="w-4 h-4" /> Logout
                  </button>
              )}
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
