import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Briefcase, FileText } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 flex flex-col items-center justify-center">
      {/* Animated subtle background circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-600/20 blur-[120px] animate-pulse" style={{ animationDuration: '5s' }}></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-500/20 mb-8 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-medium">Smart Recruitment Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
          Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Right Job</span>.<br />
          Hire the <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Right Talent</span>.
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Automatically match resumes with the right job opportunities. The simple and smart way to hire and get hired.
        </p>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/role-select"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Subtle feature hints */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-500 text-sm font-medium border-t border-slate-800/50 pt-10">
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" /> Smart Resume Parsing
          </div>
          <div className="flex items-center justify-center gap-2">
            <Briefcase className="w-4 h-4" /> Job Matching
          </div>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> AI Candidate Ranking
          </div>
          <div className="flex items-center justify-center gap-2 flex-col sm:flex-row text-center sm:text-left">
             Role-Based Access
          </div>
        </div>
      </div>
    </div>
  );
}
