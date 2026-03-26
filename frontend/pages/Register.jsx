import { useAuth } from "../src/context/AuthContext";
import { ArrowLeft, User, Briefcase, UploadCloud } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import { useState, useRef } from "react";

export default function Register() {
  const { register } = useAuth();
  const [searchParams] = useSearchParams();
  const queryRole = searchParams.get("role");
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(queryRole && ["candidate", "employer"].includes(queryRole) ? queryRole : "candidate");
  const [resume, setResume] = useState(null);
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
      setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      
      if (role === 'candidate' && !resume) {
          setError("Resume upload is required for candidates.");
          return;
      }
      
      setLoading(true);
      
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      // Map 'employer' back to 'company' as expected by backend
      formData.append("role", role === 'employer' ? 'company' : role);
      if (resume) {
          formData.append("resume", resume);
      }
      
      const res = await register(formData);
      if (!res.success) {
          setError(res.error);
      }
      setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative px-6 py-12">
       <div className="absolute top-8 left-8">
        <Link to="/role-select" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition font-medium">
          <ArrowLeft className="w-5 h-5" /> Back to roles
        </Link>
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 max-w-lg w-full border border-slate-100">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3 text-slate-900">Create an Account</h1>
            <p className="text-slate-500">Join ResumeRanker today.</p>
        </div>

        {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Role Selection Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                <button
                    type="button"
                    onClick={() => setRole("candidate")}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors flex justify-center items-center gap-2 ${role === 'candidate' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <User className="w-4 h-4" /> Candidate
                </button>
                <button
                    type="button"
                    onClick={() => setRole("employer")}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors flex justify-center items-center gap-2 ${role === 'employer' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Briefcase className="w-4 h-4" /> Employer
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input 
                    type="text" 
                    required 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input 
                    type="password" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
            </div>

            {/* Conditional File Upload for Candidates */}
            {role === "candidate" && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Your Resume (PDF/DOCX)</label>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${resume ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}`}
                    >
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <UploadCloud className={`w-8 h-8 mb-2 ${resume ? 'text-indigo-500' : 'text-slate-400'}`} />
                        <span className={`text-sm font-medium ${resume ? 'text-indigo-700' : 'text-slate-600'}`}>
                            {resume ? resume.name : 'Click to Upload Resume'}
                        </span>
                        {!resume && <span className="text-xs text-slate-400 mt-1">Required to match you with jobs</span>}
                    </div>
                </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 flex items-center justify-center gap-3 p-4 rounded-xl transition group font-semibold text-lg
                  ${role === 'employer'
                      ? 'bg-teal-600 text-white hover:bg-teal-700' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {loading ? 'Registering...' : 'Create Account'}
            </button>
        </form>
        
        <p className="mt-6 text-center text-slate-500 text-sm">
            Already have an account?{" "}
            <Link to={`/login${queryRole ? `?role=${queryRole}` : ''}`} className="text-indigo-600 hover:underline font-medium">
                Sign in
            </Link>
        </p>

      </div>
    </div>
  );
}
