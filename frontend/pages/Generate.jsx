import {
  User,
  Mail,
  FileText,
  GraduationCap,
  Briefcase,
  Download,
  CheckCircle2,
  Phone,
  Settings,
  Wand2,
  Loader2,
  Sparkles,
  Plus,
  Trash2,
  LayoutTemplate
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../src/context/AuthContext";

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
        rows={4}
        {...props}
        className="w-full p-4 bg-white border border-slate-200 shadow-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-900 outline-none placeholder:text-slate-400 resize-y"
      />
    </div>
  );
}

export default function Generate() {
  const API_BASE = "http://127.0.0.1:8000";
  const { candidateName: globalName } = useAuth();
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    template: "classic",
    education: [{ degree: "", institution: "", startDate: "", endDate: "" }],
    experience: [{ role: "", company: "", startDate: "", endDate: "", description: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (globalName) {
      setForm((prev) => ({ ...prev, name: globalName }));
    }
  }, [globalName]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDynamicChange = (field, index, e) => {
    const newItems = [...form[field]];
    newItems[index][e.target.name] = e.target.value;
    setForm({ ...form, [field]: newItems });
  };

  const addItem = (field, defaultObj) => {
    setForm({ ...form, [field]: [...form[field], defaultObj] });
  };

  const removeItem = (field, index) => {
    const newItems = form[field].filter((_, i) => i !== index);
    setForm({ ...form, [field]: newItems });
  };

  const handleGenerate = async () => {
    if (!form.name) {
      alert("Name is required");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch(`${API_BASE}/api/ats/generate-resume/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType.includes("application/pdf")) {
        throw new Error("Server did not return a PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      setPdfUrl(url);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Resume generation failed");
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
                <Wand2 className="w-8 h-8 text-indigo-300" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Generator</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                Transform your raw information into an ATS-optimized, professionally structured resume in seconds. Choose from multiple layout styles.
            </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 -mt-12 relative z-20">
        
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 md:p-10 shadow-2xl shadow-slate-200/50 border border-slate-200/60 mb-8">
          
          {/* Template Selection */}
          <div className="mb-10 p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                 <LayoutTemplate className="w-6 h-6 text-indigo-500" />
                 <h2 className="text-xl font-extrabold text-slate-900">Choose Template</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {['classic', 'modern', 'minimalist'].map(tmpl => (
                    <label 
                       key={tmpl} 
                       className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${form.template === tmpl ? 'bg-indigo-50 border-indigo-500 shadow-md text-indigo-700' : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-600'}`}
                    >
                       <input 
                         type="radio" 
                         name="template" 
                         value={tmpl} 
                         checked={form.template === tmpl} 
                         onChange={handleChange}
                         className="sr-only" 
                       />
                       <span className="font-bold capitalize">{tmpl}</span>
                       <span className="text-xs opacity-70 mt-1 capitalize">{tmpl} Design layout</span>
                    </label>
                 ))}
             </div>
          </div>

          {/* Personal Details */}
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
             <Settings className="w-6 h-6 text-indigo-500" />
             <h2 className="text-2xl font-extrabold text-slate-900">Personal Details</h2>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                icon={User}
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
              <Input
                icon={Mail}
                label="Email Address"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
            </div>

            <Input
              icon={Phone}
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
            />

            <div className="pt-4 pb-2">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                    <Sparkles className="w-6 h-6 text-indigo-500" />
                    <h2 className="text-2xl font-extrabold text-slate-900">Professional Profile</h2>
                </div>
            </div>

            <Textarea
              icon={FileText}
              label="Skills"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="Python, Machine Learning, SQL, Docker..."
            />

            {/* Dynamic Education Section */}
            <div className="pt-6">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                   <GraduationCap className="w-5 h-5 text-indigo-500" /> Education
                </span>
                <button 
                  onClick={() => addItem('education', { degree: "", institution: "", startDate: "", endDate: "" })}
                  className="text-xs flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition shadow-sm border border-indigo-100"
                >
                  <Plus className="w-3 h-3" /> Add More
                </button>
              </label>
              
              <div className="space-y-6">
                {form.education.map((edu, index) => (
                   <div key={index} className="relative p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                      {form.education.length > 1 && (
                         <button 
                           onClick={() => removeItem('education', index)}
                           className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 transition"
                         >
                           <Trash2 className="w-5 h-5" />
                         </button>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <Input label="Degree / Program" name="degree" value={edu.degree} onChange={(e) => handleDynamicChange('education', index, e)} placeholder="B.Tech Computer Science" />
                         <Input label="Institution" name="institution" value={edu.institution} onChange={(e) => handleDynamicChange('education', index, e)} placeholder="XYZ University" />
                         <Input label="Start Date" name="startDate" value={edu.startDate} onChange={(e) => handleDynamicChange('education', index, e)} placeholder="Aug 2018" />
                         <Input label="End Date" name="endDate" value={edu.endDate} onChange={(e) => handleDynamicChange('education', index, e)} placeholder="May 2022" />
                      </div>
                   </div>
                ))}
              </div>
            </div>

            {/* Dynamic Experience Section */}
            <div className="pt-6">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                   <Briefcase className="w-5 h-5 text-indigo-500" /> Experience
                </span>
                <button 
                  onClick={() => addItem('experience', { role: "", company: "", startDate: "", endDate: "", description: "" })}
                  className="text-xs flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition shadow-sm border border-indigo-100"
                >
                  <Plus className="w-3 h-3" /> Add More
                </button>
              </label>
              
              <div className="space-y-6">
                {form.experience.map((exp, index) => (
                   <div key={index} className="relative p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                      {form.experience.length > 1 && (
                         <button 
                           onClick={() => removeItem('experience', index)}
                           className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 transition"
                         >
                           <Trash2 className="w-5 h-5" />
                         </button>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <Input label="Role / Title" name="role" value={exp.role} onChange={(e) => handleDynamicChange('experience', index, e)} placeholder="Software Engineer" />
                         <Input label="Company" name="company" value={exp.company} onChange={(e) => handleDynamicChange('experience', index, e)} placeholder="Google" />
                         <Input label="Start Date" name="startDate" value={exp.startDate} onChange={(e) => handleDynamicChange('experience', index, e)} placeholder="June 2022" />
                         <Input label="End Date" name="endDate" value={exp.endDate} onChange={(e) => handleDynamicChange('experience', index, e)} placeholder="Present" />
                      </div>
                      <Textarea label="Description / Achievements" name="description" value={exp.description} onChange={(e) => handleDynamicChange('experience', index, e)} placeholder="Developed REST APIs..." />
                   </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-8 border-t border-slate-100">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="relative flex-1 py-5 rounded-2xl font-bold text-lg text-white bg-slate-900 border border-slate-700/50 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl flex items-center justify-center gap-3 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                {loading ? (
                    <div className="flex items-center gap-3 relative z-10">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-300" /> 
                        Generating...
                    </div>
                ) : (
                    <div className="flex items-center gap-2 relative z-10">
                        <Sparkles className="w-5 h-5 text-indigo-300 transition-transform group-hover:scale-110" />
                        Generate ATS-Friendly Resume
                    </div>
                )}
              </button>

              {pdfUrl && (
                <a
                  href={pdfUrl}
                  download="ATS_Resume.pdf"
                  className="relative flex-1 py-5 rounded-2xl font-bold text-lg text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-all shadow-sm flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <Download className="w-5 h-5 transition-transform" />
                  Download Resume
                </a>
              )}
            </div>

            {success && (
              <div className="mt-6 flex gap-4 p-6 rounded-2xl bg-emerald-50 border border-emerald-100 animate-in fade-in slide-in-from-bottom-4 duration-500 items-start">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="pt-1">
                  <p className="font-extrabold text-emerald-900 text-lg mb-1">Resume Generated Successfully!</p>
                  <p className="text-emerald-700 font-medium leading-relaxed">
                    Your sleek, ATS-optimized resume is ready. Click the download button
                    above to save it as a PDF.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
