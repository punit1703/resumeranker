import { useAuth } from "../src/context/AuthContext";
import { Briefcase, User, ArrowLeft, Upload, Building2, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const requestedRole = searchParams.get("role");
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [resume, setResume] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  const isCandidate = requestedRole === "candidate";
  const isEmployer = requestedRole === "employer";
  const showOptions = !isCandidate && !isEmployer;

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      const endpoint = isLogin ? "/api/ats/auth/login/" : "/api/ats/auth/register/";
      
      if (!isLogin && isCandidate && (!name || !resume)) {
          setError("Please provide your name and upload a resume.");
          setIsLoading(false);
          return;
      }
      if (!isLogin && isEmployer && !companyName) {
          setError("Please provide your company name.");
          setIsLoading(false);
          return;
      }

      try {
          const res = await fetch(`https://resume-ranker-backend-esei.onrender.com${endpoint}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  username,
                  password,
                  role: isCandidate ? "candidate" : "company",
              })
          });

          const data = await res.json();
          if (!res.ok) {
              throw new Error(data.error || "Authentication failed");
          }

          // login(selectedRole, currentToken, currentUserId, storedFile = null, name = "")
          if (isCandidate) {
              login("candidate", data.token, data.user_id, resume, isLogin ? "" : name);
              navigate("/analyze");
          } else {
              login("company", data.token, data.user_id);
              navigate("/create-job");
          }
      } catch (err) {
          setError(err.message);
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Left Panel - Branding/Visuals */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-950 items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${isEmployer ? 'bg-teal-500/20' : 'bg-indigo-500/20'} rounded-full blur-[100px] animate-pulse`} style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }}></div>
        </div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="relative z-10 p-16 max-w-2xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 mb-8 shadow-2xl">
            {isEmployer ? (
               <Building2 className="w-10 h-10 text-teal-400" />
            ) : (
               <FileText className="w-10 h-10 text-indigo-400" />
            )}
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            {isCandidate ? "Let your resume do the talking." : "Find the perfect fit."}
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed font-light">
            {isCandidate 
              ? "Upload your resume once, and our AI will automatically match you with the best roles." 
              : "Enter your company details and get instant access to top-tier, AI-ranked candidates."}
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative px-6 sm:px-12 lg:px-24 bg-white">
        
        <Link to="/role-select" className="absolute top-8 left-6 lg:left-12 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors group">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
            <ArrowLeft className="w-4 h-4" /> 
          </div>
          Back to Roles
        </Link>

        <div className="w-full max-w-md mt-16 lg:mt-0">
          {showOptions ? (
             <div className="text-center">
               <h2 className="text-3xl font-bold text-slate-900 mb-4">Welcome to ResumeRanker</h2>
               <p className="text-slate-500 mb-8">Please select a role to continue your journey.</p>
               <Link to="/role-select" className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition">
                 Select Role
               </Link>
             </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-10 text-left">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold mb-6 shadow-sm border
                  ${isCandidate ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-teal-50 text-teal-700 border-teal-100'}`}>
                   {isCandidate ? <User className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                   {isCandidate ? 'Candidate Portal' : 'Employer Portal'}
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                  {isCandidate ? 'Create your profile' : 'Company access'}
                </h2>
                <p className="text-slate-500 text-lg">
                  {isCandidate ? 'Enter your details to get matched.' : 'Provide your company name to begin.'}
                </p>
              </div>

              {error && (
                  <div className="mb-6 flex gap-3 p-4 bg-red-50/80 backdrop-blur-sm text-red-600 border border-red-200/60 rounded-2xl text-sm font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                      {error}
                  </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Generic Fields */}
                  <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Username</label>
                      <input 
                          type="text" 
                          required 
                          value={username} 
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900"
                          placeholder="johndoe123"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Password</label>
                      <input 
                          type="password" 
                          required 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900"
                          placeholder="••••••••"
                      />
                  </div>

                  {!isLogin && isCandidate && (
                      <div className="space-y-6">
                          <div>
                              <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
                              <input 
                                  type="text" 
                                  required 
                                  value={name} 
                                  onChange={(e) => setName(e.target.value)}
                                  className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900"
                                  placeholder="John Doe"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-semibold text-slate-900 mb-2">Your Resume (PDF)</label>
                              <div 
                                className={`relative group border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ease-out
                                  ${isHovering ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]' : ''}
                                  ${resume && !isHovering
                                    ? 'border-indigo-500 bg-indigo-50/30' 
                                    : !isHovering ? 'border-slate-200 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/20' : ''
                                  }`}
                              >
                                  <input 
                                      type="file" 
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                      accept=".pdf,.doc,.docx"
                                      onChange={(e) => setResume(e.target.files[0])}
                                      onDragEnter={() => setIsHovering(true)}
                                      onDragLeave={() => setIsHovering(false)}
                                      onDrop={() => setIsHovering(false)}
                                      required
                                  />
                                  <div className="flex flex-col items-center gap-4 relative z-0 pointer-events-none">
                                      <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300
                                        ${resume ? 'bg-indigo-500 text-white scale-110 shadow-lg shadow-indigo-500/30' : 'bg-white shadow-sm border border-slate-100 text-indigo-500 group-hover:scale-110 group-hover:shadow-md'}
                                      `}>
                                          {resume ? <CheckCircle2 className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-slate-900 font-semibold text-base overflow-hidden text-ellipsis px-4">
                                            {resume ? resume.name : "Click or drag to upload"}
                                        </p>
                                        <p className="text-sm font-medium text-slate-500">
                                            {resume ? "File ready for analysis" : "PDF format only (Max 5MB)"}
                                        </p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  {isCandidate && isLogin && (
                    <div className="space-y-6">
                          <div>
                              <label className="block text-sm font-semibold text-slate-900 mb-2">Optional: Upload Resume for this Session</label>
                              <div 
                                className={`relative group border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ease-out
                                  ${isHovering ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]' : ''}
                                  ${resume && !isHovering
                                    ? 'border-indigo-500 bg-indigo-50/30' 
                                    : !isHovering ? 'border-slate-200 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/20' : ''
                                  }`}
                              >
                                  <input 
                                      type="file" 
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                      accept=".pdf,.doc,.docx"
                                      onChange={(e) => setResume(e.target.files[0])}
                                      onDragEnter={() => setIsHovering(true)}
                                      onDragLeave={() => setIsHovering(false)}
                                      onDrop={() => setIsHovering(false)}
                                  />
                                  <div className="flex flex-col items-center gap-4 relative z-0 pointer-events-none">
                                      <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300
                                        ${resume ? 'bg-indigo-500 text-white scale-110 shadow-lg shadow-indigo-500/30' : 'bg-white shadow-sm border border-slate-100 text-indigo-500 group-hover:scale-110 group-hover:shadow-md'}
                                      `}>
                                          {resume ? <CheckCircle2 className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-slate-900 font-semibold text-base overflow-hidden text-ellipsis px-4">
                                            {resume ? resume.name : "Click or drag to upload"}
                                        </p>
                                        <p className="text-sm font-medium text-slate-500">
                                            {resume ? "File ready for analysis" : "PDF format only (Max 5MB)"}
                                        </p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  {!isLogin && isEmployer && (
                      <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-2">Company Name</label>
                          <input 
                              type="text" 
                              required 
                              value={companyName} 
                              onChange={(e) => setCompanyName(e.target.value)}
                              className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900"
                              placeholder="e.g. Acme Corp"
                          />
                      </div>
                  )}

                  <div className="pt-4 space-y-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-lg shadow-xl hover:-translate-y-0.5 group
                          ${isEmployer 
                              ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-600/20 hover:shadow-teal-600/40' 
                              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20 hover:shadow-indigo-600/40'
                          } disabled:opacity-75 disabled:cursor-not-allowed`}
                    >
                        {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                        {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </button>
                    <div className="text-center text-sm font-medium text-slate-500">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button 
                            type="button" 
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
                        >
                            {isLogin ? "Sign Up" : "Login"}
                        </button>
                    </div>
                  </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
