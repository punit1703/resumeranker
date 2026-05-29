import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Download, ArrowLeft, User, Sparkles, Loader2, Trophy, Medal, CheckCircle2 } from "lucide-react";
import { useAuth } from "../src/context/AuthContext";

export default function JobApplications() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [rankingStatus, setRankingStatus] = useState("idle"); // idle, loading, done
  const [rankedResults, setRankedResults] = useState(null);
  const [error, setError] = useState(null);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch job details to get title
    fetch(`https://resume-ranker-backend-esei.onrender.com/api/ats/jobs/${id}/`)
      .then((res) => res.json())
      .then((data) => setJobTitle(data.title))
      .catch(console.error);

    // Fetch applications
    fetch(`https://resume-ranker-backend-esei.onrender.com/api/ats/applications/${id}/`, {
      headers: { "Authorization": `Token ${token}` }
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
           logout();
           navigate("/login?role=employer");
           throw new Error("Unauthorized access. Please login again.");
        }
        if (!res.ok) throw new Error("Failed to fetch applications");
        return res.json();
      })
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleRankCandidates = async () => {
    setRankingStatus("loading");
    setRankedResults(null);
    try {
        const formData = new FormData();
        formData.append("job_id", id);
        formData.append("use_existing", "true");

        const res = await fetch(`https://resume-ranker-backend-esei.onrender.com/api/ats/rank/`, {
            method: "POST",
            headers: {
                "Authorization": `Token ${token}`
            },
            body: formData
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Failed to rank candidates");
        }

        const data = await res.json();
        
        // Merge AI ranked results back into our application object so we keep resume_url
        const rankedApps = data.ranked_candidates.map((rc, index) => {
            const originalApp = applications.find(a => a.candidate_name === rc.filename) || {};
            return {
                ...originalApp,
                ...rc, 
                rankIndex: index
            };
        });
        
        setRankedResults(rankedApps);
        setRankingStatus("done");
    } catch(err) {
        console.error(err);
        alert(err.message);
        setRankingStatus("idle");
    }
  };

  const getRankBadge = (index) => {
      if (index === 0) return <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30 ring-2 ring-white"><Trophy className="w-6 h-6 text-white" /></div>;
      if (index === 1) return <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center shrink-0 shadow-lg shadow-slate-400/30 ring-2 ring-white"><Medal className="w-6 h-6 text-white" /></div>;
      if (index === 2) return <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30 ring-2 ring-white"><Medal className="w-6 h-6 text-white" /></div>;
      return <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 font-bold border border-slate-200">#{index + 1}</div>;
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen text-indigo-600"><Loader2 className="w-10 h-10 animate-spin" /></div>;
  if (error) return <div className="text-center py-20 text-rose-500 font-semibold">{error}</div>;

  const displayList = rankedResults || applications;
  const isRanked = !!rankedResults;

  return (
    <section className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
                <Link to="/employer/applications" className="p-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition shadow-sm">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-slate-900">{jobTitle || "Job Applications"}</h1>
                    <p className="text-slate-500 font-medium mt-1 uppercase tracking-wider text-sm">{applications.length} Applicants</p>
                </div>
            </div>

            {applications.length > 0 && (
                <button 
                    onClick={handleRankCandidates}
                    disabled={rankingStatus === "loading"}
                    className="flex items-center gap-3 px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition shadow-xl shadow-indigo-900/20 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                >
                    {rankingStatus === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    {rankingStatus === "loading" ? "AI Analyzing..." : "Rank Candidates with AI"}
                </button>
            )}
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-slate-200">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-slate-50">
                <User className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-700 mb-2">No Applications Yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto">When candidates apply for this job, their resumes and scores will securely appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200 p-6 md:p-10 mb-10">
             
             {isRanked && (
                 <div className="mb-8 p-5 bg-gradient-to-r from-indigo-50 to-indigo-100/50 text-indigo-900 rounded-2xl border border-indigo-200/50 flex items-start sm:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                     <div className="p-3 bg-indigo-600 text-white rounded-xl shrink-0 shadow-sm">
                         <Sparkles className="w-6 h-6" />
                     </div>
                     <div>
                         <p className="font-extrabold text-lg">AI Ranking Completed successfully</p>
                         <p className="text-sm font-medium opacity-80 mt-1">Candidates have been dynamically evaluated and sorted based on their semantic match to the job requirements.</p>
                     </div>
                 </div>
             )}

             <div className="space-y-4">
                {displayList.map((app, index) => {
                  const applicantName = isRanked ? app.filename : app.candidate_name;
                  const score = isRanked ? app.ats_score : app.ats_score;
                  
                  // For ranked results, app.filename might include an extension if manually mapped, but we handle via backend replacing with candidate_name.
                  const displayName = applicantName ? applicantName.replace(/\.[^/.]+$/, "") : "Unknown Applicant";

                  return (
                  <div key={app.id || index} style={{animationDelay: `${index * 50}ms`}} className={`relative bg-white border hover:border-indigo-200 transition-all duration-300 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-6 ${isRanked ? 'animate-in fade-in slide-in-from-right-4' : ''} ${isRanked && index < 3 ? 'shadow-md border-indigo-100/50 bg-slate-50/30' : 'hover:shadow-md border-slate-100'}`}>
                    
                    <div className="flex items-center gap-5 flex-1">
                        {isRanked ? getRankBadge(index) : (
                            <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-slate-400" />
                            </div>
                        )}
                        <div>
                            <h3 className={`text-xl font-extrabold ${isRanked && index < 3 ? 'text-indigo-950' : 'text-slate-800'}`}>{displayName}</h3>
                            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                {!isRanked && app.applied_at && (
                                    <p className="text-sm font-medium text-slate-500">Applied: {new Date(app.applied_at).toLocaleDateString()}</p>
                                )}
                                {score >= 80 && (
                                    <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200/60 shadow-sm">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> High Match
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 md:w-5/12 justify-end">
                        <div className="flex-1 max-w-[200px] hidden sm:block">
                            <div className="flex justify-between text-[11px] font-extrabold tracking-wider mb-2">
                                <span className="text-slate-500 uppercase">Match Score</span>
                                <span className={`${score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-indigo-600' : 'text-rose-600'}`}>{Number(score).toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 shadow-inner">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${score >= 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : score >= 50 ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : 'bg-gradient-to-r from-rose-400 to-rose-500'}`}
                                    style={{ width: `${score}%` }}
                                >
                                     {score >= 80 && <div className="absolute top-0 left-0 w-full h-full bg-white/20 -skew-x-12 -translate-x-full animate-[shimmer_2s_infinite]"></div>}
                                </div>
                            </div>
                        </div>

                        {app.resume_url && (
                            <a 
                                href={app.resume_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 hover:text-indigo-600 transition-colors shrink-0 shadow-sm"
                            >
                                <Download className="w-4 h-4" /> <span className="hidden sm:inline">Resume</span>
                            </a>
                        )}
                    </div>
                  </div>
                )})}
             </div>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
            100% { transform: translateX(100%); }
        }
      `}} />
    </section>
  );
}
