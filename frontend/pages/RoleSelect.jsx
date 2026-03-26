import { Link } from "react-router-dom";
import { User, Briefcase, ArrowLeft } from "lucide-react";

export default function RoleSelect() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-200/40 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-teal-200/40 rounded-full blur-[100px]"></div>
      </div>

      <div className="absolute top-8 left-8 z-10">
        <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition font-medium">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
      </div>

      <div className="max-w-4xl w-full z-10 relative">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Choose Your Path</h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">Select how you want to use ResumeRanker to get the right tools tailored for you.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Candidate Card */}
          <Link
            to="/login?role=candidate"
            className="group relative bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-300 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500 transition-all duration-300">
              <User className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">I am a Candidate</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Upload your resume to instantly match with top job opportunities and visualize your skillset fit.
            </p>
            <div className="text-indigo-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
               Continue as Candidate <span aria-hidden="true">&rarr;</span>
            </div>
          </Link>

          {/* Employer Card */}
          <Link
            to="/login?role=employer"
            className="group relative bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-teal-500/10 hover:border-teal-300 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-teal-500 transition-all duration-300">
              <Briefcase className="w-8 h-8 text-teal-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">I am an Employer</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Post job openings and let our AI rank top candidate profiles based on deep semantic matching.
            </p>
             <div className="text-teal-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
               Continue as Employer <span aria-hidden="true">&rarr;</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
