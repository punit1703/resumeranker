import {
  AlertCircle,
  Briefcase,
  Loader2,
  Trophy,
  FileText,
  Target,
  CheckCircle2,
  XCircle,
  User,
  Send
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";

export default function Analyze() {
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { globalResume, candidateName: globalName } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [candidateName, setCandidateName] = useState(globalName || "");
  const [localResume, setLocalResume] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyResult, setApplyResult] = useState(null);

  useEffect(() => {
    fetch("https://resume-ranker-backend-esei.onrender.com/api/ats/jobs/")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error(err));
      
    if (globalResume) {
      setLocalResume(globalResume);
    }
  }, [globalResume]);

  const handleAnalyze = async () => {
    if (!selectedJob) {
      setError("Please select a job position first.");
      return;
    }
    const resumeToUse = localResume || globalResume;
    if (!resumeToUse) {
      setError("Please upload a resume.");
      return;
    }

    setLoading(true);
    setError(null);
    setScoreData(null);
    setApplyResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", resumeToUse);
      formData.append("job_desc_id", selectedJob);

      const res = await fetch("https://resume-ranker-backend-esei.onrender.com/api/ats/score/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze resume.");
      }

      setScoreData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while analyzing.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyJob = async () => {
    if (!candidateName.trim()) {
      setError("Please enter your full name before applying.");
      return;
    }

    setApplyLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", localResume || globalResume);
      formData.append("candidate_name", candidateName);

      const res = await fetch(`https://resume-ranker-backend-esei.onrender.com/api/ats/jobs/${selectedJob}/apply/`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
         throw new Error(data.error || "Failed to submit application.");
      }
      
      setApplyResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while submitting your application.");
    } finally {
      setApplyLoading(false);
    }
  };

  const getScoreColorInfo = (score) => {
    if (score >= 80) return { text: "text-emerald-400", gradient: ["#34d399", "#10b981"], glow: "bg-emerald-500" };
    if (score >= 60) return { text: "text-blue-400", gradient: ["#60a5fa", "#3b82f6"], glow: "bg-blue-500" };
    if (score >= 40) return { text: "text-amber-400", gradient: ["#fbbf24", "#f59e0b"], glow: "bg-amber-500" };
    return { text: "text-rose-400", gradient: ["#fb7185", "#e11d48"], glow: "bg-rose-500" };
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-24 -mt-24 -mb-10">
      
      {/* Hero Header */}
      <div className="relative bg-slate-900 text-white overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-0 left-10 w-72 h-72 bg-teal-500/20 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6 ring-1 ring-white/20 shadow-xl">
                <Target className="w-8 h-8 text-indigo-300" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                Apply & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Analyze</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                Submit your application directly. Our system will immediately score your resume against the job requirements and confirm your eligibility.
            </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 -mt-12 relative z-20">
        
        {/* Application Form Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl shadow-slate-200/50 border border-slate-200/60 mb-8 flex flex-col items-start justify-between gap-6">
           <div className="flex items-center gap-5 w-full pb-6 border-b border-slate-100">
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${localResume ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'}`}>
                   {localResume ? <FileText className="w-7 h-7" /> : <AlertCircle className="w-7 h-7" />}
               </div>
               <div className="w-full">
                   <h3 className="text-lg font-bold text-slate-900">
                       {localResume ? 'Resume Ready' : 'Resume Required'}
                   </h3>
                   <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between mt-1 text-sm gap-2">
                       <p className="text-slate-500 font-medium truncate max-w-[200px] sm:max-w-md">
                           {localResume 
                              ? `Document: ${localResume.name}` 
                              : 'Please upload your resume.'}
                       </p>
                       <label className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-semibold underline underline-offset-2">
                           {localResume ? 'Change Resume' : 'Upload Resume'}
                           <input 
                             type="file" 
                             className="hidden" 
                             accept=".pdf,.doc,.docx"
                             onChange={(e) => {
                               if (e.target.files && e.target.files[0]) {
                                 setLocalResume(e.target.files[0]);
                                 setScoreData(null);
                                 setApplyResult(null);
                               }
                             }}
                           />
                       </label>
                   </div>
               </div>
           </div>

           {!localResume ? (
              <div className="w-full py-4 mt-2 bg-slate-100 text-slate-500 font-semibold rounded-xl text-center">
                 A resume is required to proceed
              </div>
           ) : (
              <div className="w-full space-y-5">
                  
                  {/* Name Input */}
                  <div>
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" /> Candidate Name
                      </label>
                      <input 
                          type="text"
                          placeholder="e.g. John Doe"
                          className="w-full p-4 bg-white border border-slate-200 shadow-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-900 outline-none placeholder:text-slate-400"
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                      />
                  </div>

                  {/* Job Select */}
                  <div>
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-slate-400" /> Select Position
                      </label>
                      <select 
                          className="w-full p-4 bg-white border border-slate-200 shadow-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-700 outline-none appearance-none cursor-pointer"
                          value={selectedJob}
                          onChange={(e) => {
                             setSelectedJob(e.target.value);
                             setScoreData(null);
                             setApplyResult(null);
                          }}
                      >
                          <option value="" disabled>-- Choose a Job Profile --</option>
                          {jobs.map(job => (
                              <option key={job.id} value={job.id}>{job.title} at {job.company}</option>
                          ))}
                      </select>
                  </div>
                  
                  <button 
                      onClick={handleAnalyze} 
                      disabled={loading || !selectedJob}
                      className="w-full mt-4 py-4 rounded-xl font-bold text-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                      {loading ? (
                          <>
                             <Loader2 className="w-6 h-6 animate-spin" /> Analyzing Match...
                          </>
                      ) : (
                          <>
                             <Target className="w-6 h-6" /> Analyze Resume
                          </>
                      )}
                  </button>
              </div>
           )}
        </div>

        {error && (
            <div className="mb-10 p-5 bg-red-50/80 backdrop-blur-sm text-red-700 rounded-2xl border border-red-200 font-medium flex gap-3 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                <AlertCircle className="w-6 h-6 shrink-0 text-red-500" />
                <p>{error}</p>
            </div>
        )}

        {/* Results Section */}
        {!loading && scoreData && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 mt-12 mb-20 w-full">
                <div className="relative rounded-[2.5rem] p-[1px] bg-gradient-to-b from-slate-700 to-slate-900 shadow-2xl overflow-hidden group">
                    {/* Glowing background effects */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-indigo-500/20 blur-[120px] pointer-events-none rounded-full"></div>
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 opacity-20 blur-[100px] pointer-events-none rounded-full ${getScoreColorInfo(scoreData.ats_score).glow}`}></div>

                    <div className="relative bg-slate-950/80 backdrop-blur-2xl rounded-[2.4rem] p-10 flex flex-col items-center gap-8 shadow-inner shadow-white/5">
                        {/* Score Circle Area */}
                        <div className="flex flex-col items-center justify-center relative w-full pt-4">
                           <h3 className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm mb-10 relative z-10 flex items-center gap-3">
                               <Target className="w-5 h-5 text-indigo-400" />
                               ATS Match Score
                           </h3>
                           
                           <div className="relative inline-flex items-center justify-center">
                               {/* Outer decorative rings */}
                               <div className="absolute inset-0 rounded-full border border-slate-700/50 scale-[1.12] border-dashed"></div>
                               <div className="absolute inset-0 rounded-full border border-slate-800/80 scale-[1.25]"></div>
                               
                               <svg className="w-48 h-48 transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                  <defs>
                                    <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" stopColor={getScoreColorInfo(scoreData.ats_score).gradient[0]} />
                                      <stop offset="100%" stopColor={getScoreColorInfo(scoreData.ats_score).gradient[1]} />
                                    </linearGradient>
                                  </defs>
                                  <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800/50 relative z-0" />
                                  <circle 
                                    cx="96" cy="96" r="84" stroke="url(#score-gradient)" strokeWidth="12" fill="transparent" 
                                    strokeDasharray="527.78" strokeDashoffset={527.78 - (527.78 * scoreData.ats_score) / 100} 

                                    className="transition-all duration-1500 ease-out drop-shadow-lg" 
                                    strokeLinecap="round"
                                  />
                               </svg>
                               <div className="absolute inset-0 flex flex-col items-center justify-center mt-2">
                                 <div className="text-6xl font-black text-white tracking-tighter flex items-start">
                                   {scoreData.ats_score}
                                   <span className="text-2xl text-slate-500 font-bold mt-1 ml-1">%</span>
                                 </div>
                               </div>
                           </div>
                        </div>

                        <div className="w-full pt-10 border-t border-slate-800/60 relative z-10 mt-4">
                            {/* Apply Button or Success Section */}
                            {applyResult ? (
                               <div className={`p-6 rounded-2xl border ${applyResult.eligible ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'} flex flex-col items-center gap-4 animate-in zoom-in-95 backdrop-blur-md`}>
                                   {applyResult.eligible ? (
                                       <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                           <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                                       </div>
                                   ) : (
                                       <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                                           <XCircle className="w-8 h-8 text-rose-400" />
                                       </div>
                                   )}
                                   <div className="text-center">
                                       <h4 className={`text-2xl font-bold mb-2 ${applyResult.eligible ? 'text-emerald-400' : 'text-rose-400'}`}>
                                           {applyResult.eligible ? 'Application Accepted!' : 'Not Eligible'}
                                       </h4>
                                       <p className={`font-medium text-slate-300 leading-relaxed`}>
                                           {applyResult.message}
                                       </p>
                                   </div>
                               </div>
                            ) : (
                               <div className="relative group cursor-pointer w-full">
                                   <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-md opacity-40 group-hover:opacity-100 transition duration-500"></div>
                                   <button 
                                       onClick={handleApplyJob}
                                       disabled={applyLoading || !candidateName.trim()}
                                       className="relative w-full py-5 rounded-2xl font-bold text-lg text-white bg-slate-900 border border-slate-700/50 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl flex items-center justify-center gap-3 overflow-hidden"
                                   >
                                       {applyLoading ? (
                                           <>
                                              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" /> Submitting...
                                           </>
                                       ) : (
                                           <div className="flex items-center gap-3 relative z-10 transition-transform duration-300 group-hover:scale-105">
                                              <Send className="w-6 h-6 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-indigo-300 transition-all duration-300" /> 
                                              Apply for this Job
                                           </div>
                                       )}
                                   </button>
                               </div>
                            )}
                            
                            {!candidateName.trim() && !applyResult && (
                               <div className="mt-5 flex items-center justify-center gap-2 text-rose-400/90 text-sm font-medium bg-rose-500/10 py-3 px-4 rounded-xl border border-rose-500/20">
                                   <User className="w-4 h-4" />
                                   Please fill out your Candidate Name above to apply.
                               </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
