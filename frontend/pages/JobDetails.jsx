import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Upload, CheckCircle, XCircle, Briefcase, Building2, MapPin, 
  Target, ChevronRight, FileText, AlertCircle, User, Send, Loader2, CheckCircle2
} from "lucide-react";
import { useAuth } from "../src/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const navigate = useNavigate();
  
  const { globalResume, candidateName: globalName, token, logout } = useAuth();
  
  const [resume, setResume] = useState(null);
  const [candidateName, setCandidateName] = useState("");
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (globalName) {
      setCandidateName(globalName);
    }
  }, [globalName]);

  useEffect(() => {
    if (globalResume) {
      setResume(globalResume);
    }
  }, [globalResume]);

  useEffect(() => {
    fetch(`https://resume-ranker-backend-esei.onrender.com/api/ats/jobs/${id}/`)
      .then((res) => res.json())
      .then((data) => setJob(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume || !candidateName) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("candidate_name", candidateName);

    try {
      const response = await fetch(
        `https://resume-ranker-backend-esei.onrender.com/api/ats/jobs/${id}/apply/`,
        {
          method: "POST",
          headers: {
            "Authorization": `Token ${token}`
          },
          body: formData,
        }
      );
      if (response.status === 401 || response.status === 403) {
          logout();
          navigate("/login?role=candidate");
          return;
      }
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error applying:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!job) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20 -mt-24">
      {/* Hero Header */}
      <div className="relative bg-slate-900 text-white overflow-hidden pt-32 pb-24 lg:pt-36 lg:pb-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-0 left-10 w-72 h-72 bg-teal-500/20 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20 text-indigo-200 text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                {job.company}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-white">
                {job.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-slate-300 text-sm sm:text-base font-medium">
                <span className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg"><MapPin className="w-4 h-4 text-rose-400" /> Remote / On-site</span>
                <span className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg"><Briefcase className="w-4 h-4 text-blue-400" /> Full Time</span>
                <span className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg"><Target className="w-4 h-4 text-emerald-400" /> Min. Score: {job.min_score_required}%</span>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 -mt-12 relative z-20 grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Job Info (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 p-8 sm:p-10 transition-all hover:shadow-2xl hover:shadow-slate-200/60">
            <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-1.5 h-7 bg-indigo-500 rounded-full"></div>
                About the Role
            </h3>
            <div className="prose prose-indigo max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap mb-10 text-lg font-light">
              {job.description}
            </div>

            {job.skills && job.skills.length > 0 && (
                <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-500" /> Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                        {job.skills.map((skill, index) => (
                            <span key={index} className="px-4 py-1.5 bg-indigo-50/80 text-indigo-700 rounded-xl text-sm font-semibold border border-indigo-100/50 shadow-sm transition-all hover:bg-indigo-100 hover:scale-105 cursor-default">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
          </div>
          
           <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 rounded-2xl p-6 sm:p-8 border border-indigo-100/80 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                        <h4 className="font-bold text-indigo-950 text-lg">Are you an admin for this job?</h4>
                        <p className="text-sm text-indigo-700 mt-1 font-medium">Check the applications received so far.</p>
                    </div>
                    <Link 
                        to={`/jobs/${id}/applications`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-slate-50 hover:text-indigo-700 transition shadow-sm border border-indigo-200 active:scale-95 whitespace-nowrap"
                    >
                        View Applications
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
           </div>
        </div>

        {/* Application Form (Right Column - Sticky) */}
        <div className="lg:col-span-1 sticky top-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 p-6 sm:p-8 overflow-hidden relative">
            
            {/* Form decorative background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full pointer-events-none opacity-50"></div>
            
            <h2 className="text-2xl font-extrabold mb-8 text-slate-900 border-b border-slate-100 pb-4 relative z-10">
                Apply Now
            </h2>
            
            {!result ? (
              <form onSubmit={handleApply} className="space-y-6 relative z-10 w-full">
                
                {/* File Upload / Resume Display */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                       {resume ? <FileText className="w-4 h-4 text-indigo-500" /> : <Upload className="w-4 h-4 text-slate-400" />} Resume Request (PDF)
                  </label>
                  
                  <div className={`group border-2 border-dashed ${resume ? 'border-indigo-300 bg-indigo-50/50 hover:border-indigo-400 hover:bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-slate-100'} rounded-xl p-6 text-center cursor-pointer transition-all relative overflow-hidden`}>
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      accept=".pdf"
                      onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                              setResume(e.target.files[0]);
                          }
                      }}
                      required={!resume}
                    />
                    
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110 ${resume ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-200 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                        {resume ? <FileText className="w-7 h-7" /> : <Upload className="w-7 h-7" />}
                    </div>
                    
                    {resume ? (
                        <div className="space-y-1 relative z-20">
                            <p className="text-sm font-bold text-slate-900 truncate px-2">{resume.name}</p>
                            <p className="text-xs text-indigo-600 font-medium">Click to change file</p>
                        </div>
                    ) : (
                        <div className="space-y-1 relative z-20">
                            <p className="text-sm font-bold text-slate-700">Click to browse or drag</p>
                            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">PDF files only</p>
                        </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" /> Full Name
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-white border border-slate-200 shadow-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    placeholder="e.g. John Doe"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    required 
                  />
                </div>

                <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={loading || !resume || !candidateName.trim()}
                      className="relative w-full py-5 rounded-2xl font-bold text-lg text-white bg-slate-900 border border-slate-700/50 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                      {loading ? (
                          <div className="flex items-center gap-3 relative z-10">
                              <Loader2 className="w-6 h-6 animate-spin text-indigo-300" /> 
                              Submitting...
                          </div>
                      ) : (
                          <div className="flex items-center gap-2 relative z-10">
                              Submit Application
                              <Send className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 text-indigo-300" />
                          </div>
                      )}
                    </button>
                </div>
              </form>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4">
                  <div className={`p-8 rounded-2xl border flex flex-col items-center gap-4 text-center ${result.eligible ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                    
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 shadow-inner ${result.eligible ? 'bg-emerald-100 text-emerald-500 shadow-emerald-200/50' : 'bg-rose-100 text-rose-500 shadow-rose-200/50'}`}>
                        {result.eligible ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
                    </div>
                    
                    <div>
                        <h3 className={`text-2xl font-extrabold mb-2 ${result.eligible ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {result.eligible ? 'Excellent Match!' : 'Not Eligible'}
                        </h3>
                        <p className={`text-base font-medium leading-relaxed ${result.eligible ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {result.message}
                        </p>
                    </div>
                    
                    <div className="w-full mt-4 p-5 bg-white rounded-xl shadow-sm border border-slate-100">
                        <div className="text-4xl font-black text-slate-800 mb-1 tracking-tighter">
                            {result.ats_score}<span className="text-2xl text-slate-400">%</span>
                        </div>
                        <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">ATS Match Score</div>
                    </div>
                    
                    <button 
                      onClick={() => { setResult(null); setResume(null); setCandidateName(""); }}
                      className="mt-4 text-sm font-bold text-slate-500 hover:text-indigo-600 underline underline-offset-4 decoration-2 decoration-slate-300 hover:decoration-indigo-300 transition-colors"
                    >
                      Submit another application
                    </button>
                  </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
