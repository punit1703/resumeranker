import { useEffect, useState } from "react";
import { Briefcase, Building2, Target, ChevronRight, Loader2, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Jobs");

  const categories = [
    { name: "All Jobs", id: "all" },
    { name: "Machine Learning & AI", id: "ml", keywords: ["ml", "ai", "machine learning", "data", "artificial intelligence"] },
    { name: "Software & Fullstack", id: "se", keywords: ["software", "developer", "engineer", "fullstack", "frontend", "backend", "web", "app"] },
    { name: "Non-IT & General", id: "non-it" }
  ];

  const filteredJobs = jobs.filter(job => {
    if (selectedCategory === "All Jobs") return true;
    
    const titleLower = job.title.toLowerCase();
    
    if (selectedCategory === "Machine Learning & AI") {
       return categories.find(c => c.id === "ml").keywords.some(k => titleLower.includes(k));
    }
    
    if (selectedCategory === "Software & Fullstack") {
       return categories.find(c => c.id === "se").keywords.some(k => titleLower.includes(k));
    }
    
    const isML = categories.find(c => c.id === "ml").keywords.some(k => titleLower.includes(k));
    const isSE = categories.find(c => c.id === "se").keywords.some(k => titleLower.includes(k));
    return !isML && !isSE;
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/ats/jobs/")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-24 -mt-24 -mb-10">
      
      {/* Hero Header */}
      <div className="relative bg-slate-900 text-white overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]"></div>
           <div className="absolute top-1/2 left-10 w-72 h-72 bg-teal-500/20 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6 ring-1 ring-white/20 shadow-xl">
                <Briefcase className="w-8 h-8 text-indigo-300" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Opportunities</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                Explore top-tier roles actively matching our AI-driven ATS engine. Find the perfect fit for your highly ranked resume.
            </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 -mt-12 relative z-20">
        
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl shadow-slate-200/50 border border-slate-200/60 mb-8 min-h-[500px]">
           <div className="flex flex-col md:flex-row md:items-center justify-between w-full pb-6 border-b border-slate-100 mb-8 gap-4">
               <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-3 shrink-0">
                   <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                       <Search className="w-5 h-5" />
                   </div>
                   Available Roles
               </h3>
               
               {/* Category Filter Pills */}
               <div className="flex flex-wrap items-center gap-2">
                   {categories.map((cat) => (
                      <button
                         key={cat.id}
                         onClick={() => setSelectedCategory(cat.name)}
                         className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                            selectedCategory === cat.name 
                              ? 'bg-slate-900 text-white shadow-md scale-105' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                         }`}
                      >
                         {cat.name}
                      </button>
                   ))}
               </div>
           </div>

           {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                  <p className="font-medium text-lg text-slate-500">Loading open positions...</p>
              </div>
           ) : filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <Briefcase className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-700 mb-2">No jobs found in this category.</h3>
                 <p className="text-slate-500 max-w-md">Try selecting a different category or check back later.</p>
              </div>
           ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {filteredJobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.id}`}
                    className="group relative bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all duration-300 ease-out hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full pointer-events-none"></div>

                    <div className="flex flex-col h-full relative z-10">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-1">{job.title}</h3>
                                    <p className="text-slate-500 font-medium text-sm flex items-center gap-1.5 line-clamp-1">
                                        <Briefcase className="w-3.5 h-3.5" /> {job.company}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100/50 shadow-sm">
                                <Target className="w-3.5 h-3.5" />
                                Min. ATS Score: {job.min_score_required}%
                            </div>

                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:scale-110 shadow-sm">
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                  </Link>
                ))}
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
