import { useState } from "react";
import { Briefcase, Building2, FileText, CheckCircle2, AlertCircle, X, Plus, Target, CheckCircle, Loader2, Send } from "lucide-react";
import { useAuth } from "../src/context/AuthContext";
import { useNavigate } from "react-router-dom";

function Input({ icon: Icon, label, ...props }) {
  return (
    <div className="group w-full">
      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-indigo-500 transition-transform group-focus-within:scale-110" />}
        {label}
      </label>
      <input
        {...props}
        className="w-full p-4 bg-white border border-slate-200 shadow-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-900 outline-none placeholder:text-slate-400"
      />
    </div>
  );
}

function Textarea({ icon: Icon, label, ...props }) {
    return (
      <div className="group w-full">
        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-indigo-500 transition-transform group-focus-within:scale-110" />}
          {label}
        </label>
        <textarea
          rows={6}
          {...props}
          className="w-full p-4 bg-white border border-slate-200 shadow-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-900 outline-none placeholder:text-slate-400 resize-y"
        />
      </div>
    );
  }

export default function CreateJob() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [minScore, setMinScore] = useState(50);
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleAddSkill = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && currentSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(currentSkill.trim())) {
        setSkills([...skills, currentSkill.trim()]);
      }
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        "https://resume-ranker-backend-esei.onrender.com/api/ats/jobs/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
          },
          body: JSON.stringify({
            title,
            company_name: company,
            description,
            skills,
            min_score_required: minScore,
          }),
        }
      );

      const data = await response.json();
      
      if (response.status === 401 || response.status === 403) {
          logout();
          navigate("/login?role=employer");
          return;
      }

      if (response.ok) {
        setMessage({ type: "success", text: data.message || "Job Created Successfully" });
        setTitle("");
        setCompany("");
        setDescription("");
        setSkills([]);
        setMinScore(50);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to create job" });
      }
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Error creating job. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20 -mt-24">
      {/* Hero Header */}
      <div className="relative bg-slate-900 text-white overflow-hidden pt-32 pb-24 lg:pt-36 lg:pb-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute -top-24 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]"></div>
           <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/20 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6 ring-1 ring-white/20 shadow-xl">
                <Briefcase className="w-8 h-8 text-indigo-300" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                Post a New <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Job</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                Define the perfect role, set the required ATS standards, and start ranking top-tier candidates efficiently.
            </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 md:p-10 shadow-2xl shadow-slate-200/50 border border-slate-200/60 mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-8 border-b border-slate-100 pb-4 flex items-center gap-3">
                <Target className="w-6 h-6 text-indigo-500" />
                Job Specifications
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                   icon={Briefcase}
                   label="Job Title"
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}
                   placeholder="e.g. Senior Product Designer"
                   required
                />
                <Input
                   icon={Building2}
                   label="Company Name"
                   value={company}
                   onChange={(e) => setCompany(e.target.value)}
                   placeholder="e.g. Acme Corp"
                   required
                />
              </div>

              <Textarea 
                icon={FileText}
                label="Job Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the role, responsibilities, and requirements..."
                required
              />

              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                   Required Skills
                </label>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        onKeyDown={handleAddSkill}
                        className="flex-1 p-4 bg-white border border-slate-200 shadow-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-900 outline-none placeholder:text-slate-400"
                        placeholder="Type a skill and press Enter (e.g. React)"
                    />
                    <button 
                        type="button"
                        onClick={handleAddSkill}
                        className="px-6 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl hover:bg-indigo-100 transition shadow-sm font-bold active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="flex flex-wrap gap-2.5 min-h-[40px] p-4 bg-slate-50 border border-slate-200 rounded-xl items-center">
                    {skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-bold shadow-sm fade-in">
                            {skill}
                            <button type="button" onClick={() => removeSkill(skill)} className="hover:text-rose-600 transition-colors bg-white/50 rounded-full p-0.5">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {skills.length === 0 && (
                        <p className="text-sm text-slate-400 font-medium italic">Added skills will appear here...</p>
                    )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center justify-between">
                  <span>Minimum ATS Score Required</span>
                  <span className="text-2xl font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">{minScore}%</span>
                </label>
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={minScore}
                        onChange={(e) => setMinScore(e.target.value)}
                        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 shadow-inner"
                    />
                     <div className="flex justify-between text-xs text-slate-400 mt-4 font-bold uppercase">
                        <span>Leniant (0%)</span>
                        <span>Strict (100%)</span>
                    </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={loading || !title || !company || !description}
                    className="relative w-full py-5 rounded-2xl font-bold text-lg text-white bg-slate-900 border border-slate-700/50 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl flex items-center justify-center gap-3 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    {loading ? (
                        <div className="flex items-center gap-3 relative z-10">
                            <Loader2 className="w-6 h-6 animate-spin text-indigo-300" /> 
                            Creating Job...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 relative z-10">
                            Create Job Posting
                            <Send className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 text-indigo-300" />
                        </div>
                    )}
                  </button>
              </div>
            </form>

            {/* Success/Error Message */}
            {message && (
              <div className={`mt-6 flex gap-4 p-6 rounded-2xl border animate-in fade-in slide-in-from-bottom-4 duration-500 items-start ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${message.type === 'success' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <AlertCircle className="w-6 h-6 text-rose-600" />}
                </div>
                <div className="pt-2">
                  <p className={`font-extrabold text-lg mb-1 ${message.type === 'success' ? 'text-emerald-900' : 'text-rose-900'}`}>{message.text}</p>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
