import { Users, Trophy, Briefcase, Upload, FileText, ChevronDown, CheckCircle2, Medal, Loader2, Sparkles, Target, Activity } from "lucide-react";
import { useState, useEffect } from "react";

export default function Rank() {
  const API_BASE = "http://127.0.0.1:8000";

  const [files, setFiles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [result, setResult] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/ats/jobs/`);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type === "application/pdf" || 
      file.name.endsWith(".doc") || 
      file.name.endsWith(".docx")
    );
    
    if (droppedFiles.length) {
        setFiles(prev => [...prev, ...droppedFiles]);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length) {
        setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index) => {
      setFiles(files.filter((_, i) => i !== index));
  };

  const handleRank = async () => {
    if (!files.length || !selectedJobId) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    files.forEach((file) => formData.append("resumes", file));
    formData.append("job_id", selectedJobId);

    try {
      const res = await fetch(`${API_BASE}/api/ats/rank/`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data.ranked_candidates);
      setJobTitle(data.job_title);
    } catch (err) {
      console.error(err);
      alert("Ranking failed");
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (index) => {
      if (index === 0) return <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30 ring-2 ring-white"><Trophy className="w-5 h-5 text-white" /></div>;
      if (index === 1) return <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center shrink-0 shadow-lg shadow-slate-400/30 ring-2 ring-white"><Medal className="w-5 h-5 text-white" /></div>;
      if (index === 2) return <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30 ring-2 ring-white"><Medal className="w-5 h-5 text-white" /></div>;
      return <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 font-bold border border-slate-200">#{index + 1}</div>;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20 -mt-24 pt-24 overflow-x-hidden">
      
      <div className="w-full h-80 bg-slate-900 absolute top-0 left-0 -z-10 overflow-hidden">
          <div className="absolute top-10 right-20 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 lg:mt-8">
        
        {/* Title Area */}
        <div className="text-center mb-10 text-white">
             <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6 ring-1 ring-white/20 shadow-xl">
                <Activity className="w-8 h-8 text-indigo-300" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                ATS <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Leaderboard</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto font-light">
                Upload massive batches of resumes and instantly filter the absolute best candidates for your open roles.
            </p>
        </div>

        {/* Dashboard Split Container */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* LEFT PANE: Mission Control (Light) */}
            <div className="w-full lg:w-[400px] shrink-0 bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none"></div>

                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                    <Target className="w-6 h-6 text-indigo-500" />
                    <h2 className="text-xl font-bold text-slate-800">Launch Setup</h2>
                </div>

                <div className="space-y-8 relative z-10">
                    {/* Job Select */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                           <Briefcase className="w-4 h-4 text-indigo-500" /> Target Role
                        </label>
                        <div className="relative">
                            <select
                                value={selectedJobId}
                                onChange={(e) => setSelectedJobId(e.target.value)}
                                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 p-4 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium outline-none cursor-pointer hover:bg-slate-100"
                            >
                                <option value="" disabled className="text-slate-400">Select Job Posting</option>
                                {jobs.map((job) => (
                                <option key={job.id} value={job.id} className="text-slate-800 bg-white">
                                    {job.title} — {job.company}
                                </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Resumes Upload Layer */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                           <Users className="w-4 h-4 text-indigo-500" /> Candidate Files
                        </label>

                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById("multi-upload").click()}
                            className={`
                            border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
                            ${isDragging ? "border-indigo-400 bg-indigo-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300"}
                            `}
                        >
                            <Upload className={`w-10 h-10 mx-auto mb-4 transition-colors ${isDragging ? 'text-indigo-500' : 'text-slate-400'}`} />
                            <p className="font-bold text-slate-700 mb-1">Click or drag files to upload</p>
                            <p className="text-xs text-slate-500">PDF, DOC, DOCX up to 10MB</p>
                        </div>
                        <input
                            id="multi-upload"
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {/* Uploaded Files Pipeline */}
                        {files.length > 0 && (
                            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 max-h-48 overflow-y-auto custom-scrollbar-light">
                                <div className="flex justify-between items-center mb-3 text-xs font-bold text-slate-500 uppercase">
                                     <span>{files.length} FILES LOADED</span>
                                     <button onClick={() => setFiles([])} className="hover:text-rose-500 text-slate-400 transition">Clear All</button>
                                </div>
                                <div className="space-y-2">
                                    {files.map((file, i) => (
                                        <div key={i} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 group shadow-sm">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                                                <span className="text-sm text-slate-700 truncate font-medium">{file.name}</span>
                                            </div>
                                            <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-slate-400 hover:text-rose-500 transition shrink-0 ml-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleRank}
                        disabled={!files.length || !selectedJobId || loading}
                        className="relative w-full py-5 rounded-xl font-bold text-lg text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-900/20 active:scale-[0.98] flex justify-center items-center overflow-hidden"
                    >
                        {loading ? (
                            <span className="flex items-center gap-3">
                                <Loader2 className="w-5 h-5 animate-spin" /> Processing AI...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5" /> Execute Ranking
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* RIGHT PANE: The Arena / Leaderboard (Light/Glass) */}
            <div className={`flex-1 min-h-[500px] bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-2xl shadow-slate-200/50 transition-all duration-500 relative ${result ? '' : 'flex items-center justify-center'}`}>
                
                {!result && !loading && (
                    <div className="text-center text-slate-500 flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-slate-50">
                            <Users className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-700 mb-2">Awaiting Candidates</h3>
                        <p className="text-slate-500 max-w-sm">Setup your launch parameters on the left and engage ranking to view the leaderboard.</p>
                    </div>
                )}

                {loading && (
                    <div className="text-center flex flex-col items-center justify-center absolute inset-0 bg-white/80 backdrop-blur-sm z-10 rounded-3xl text-indigo-600">
                        <div className="w-20 h-20 mb-6 bg-indigo-50 rounded-2xl flex items-center justify-center shadow-inner">
                            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-black mb-2 animate-pulse">Analyzing Match Data</h3>
                        <p className="text-slate-500 font-medium">Extracting semantic features from {files.length} resumes...</p>
                    </div>
                )}

                {result && !loading && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                            <div>
                                <p className="text-sm font-bold text-indigo-500 uppercase tracking-wider mb-1">Official Leaderboard</p>
                                <h3 className="text-3xl font-black text-slate-900">{jobTitle}</h3>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold text-slate-700">
                                <Users className="w-4 h-4 text-indigo-500" />
                                {result.length} Candidates Screened
                            </div>
                        </div>

                        <div className="space-y-4">
                            {result.map((r, i) => {
                                const isTop3 = i < 3;
                                return (
                                <div 
                                    key={i} 
                                    style={{animationDelay: `${i * 100}ms`}}
                                    className={`relative p-5 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center gap-4 animate-in fade-in slide-in-from-right-8 duration-500 hover:scale-[1.01] transition-transform ${
                                        i === 0 ? "bg-gradient-to-r from-amber-50 to-white border border-amber-200 shadow-md" :
                                        i === 1 ? "bg-gradient-to-r from-slate-50 to-white border border-slate-200 shadow-sm" :
                                        i === 2 ? "bg-gradient-to-r from-orange-50 to-white border border-orange-200 shadow-sm" :
                                        "bg-white border border-slate-100 shadow-sm hover:shadow-md"
                                    }`}
                                >
                                    {/* Rank Badge */}
                                    <div className="flex items-center gap-4 flex-1">
                                        {getRankBadge(i)}
                                        
                                        <div>
                                            <p className={`font-extrabold text-lg md:text-xl truncate ${i === 0 ? 'text-amber-900' : 'text-slate-800'}`}>
                                                {r.filename.replace(/\.[^/.]+$/, "")}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {r.ats_score >= 80 ? (
                                                     <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                                        <CheckCircle2 className="w-3 h-3" /> Excellent Match
                                                     </span>
                                                ) : r.ats_score >= 50 ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                                        Standard Match
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                                                        Poor Match
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Score Bar */}
                                    <div className="flex items-center gap-5 md:w-1/3">
                                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden shrink-0 border border-slate-200/50 inset-shadow">
                                            <div
                                                className={`h-full rounded-full relative overflow-hidden transition-all duration-1000 ease-out ${
                                                    r.ats_score >= 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 
                                                    r.ats_score >= 50 ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : 
                                                    'bg-gradient-to-r from-rose-400 to-rose-500'
                                                }`}
                                                style={{ width: `${r.ats_score}%` }}
                                            >
                                                {/* Shine effect on bar */}
                                                <div className="absolute top-0 left-0 w-full h-full bg-white/20 -skew-x-12 -translate-x-full animate-[shimmer_2s_infinite]"></div>
                                            </div>
                                        </div>
                                        <div className="w-16 text-right shrink-0">
                                            <p className={`font-black text-2xl ${
                                                i === 0 ? 'text-amber-600' :
                                                r.ats_score >= 80 ? 'text-emerald-600' : 
                                                r.ats_score >= 50 ? 'text-indigo-600' : 'text-rose-600'
                                            }`}>
                                                {r.ats_score}<span className="text-base opacity-70">%</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

        </div>
      </div>
    
      {/* Global CSS for custom animations / scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
            100% { transform: translateX(100%); }
        }
        .custom-scrollbar-light::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-track {
            background: rgba(241, 245, 249, 0.5); 
            border-radius: 4px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-thumb {
            background: rgba(148, 163, 184, 0.5); 
            border-radius: 4px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-thumb:hover {
            background: rgba(148, 163, 184, 0.8); 
        }
      `}} />
    </div>
  );
}