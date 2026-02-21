import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Upload, CheckCircle, XCircle, Briefcase, Building2, MapPin, Target, ChevronRight } from "lucide-react";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [candidateName, setCandidateName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/ats/jobs/${id}/`)
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
        `http://127.0.0.1:8000/api/ats/jobs/${id}/apply/`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error applying:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!job) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Banner */}
      <div className="bg-indigo-900 text-white min-h-[220px] flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full py-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800 text-indigo-200 text-sm font-medium mb-4">
                <Building2 className="w-4 h-4" />
                {job.company}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{job.title}</h1>
            <div className="flex flex-wrap gap-6 text-indigo-200 text-sm sm:text-base">
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Remote / On-site</span>
                <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> Full Time</span>
                <span className="flex items-center gap-2"><Target className="w-4 h-4" /> Min. Score: {job.min_score_required}%</span>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 grid lg:grid-cols-3 gap-8">
        
        {/* Job Info (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                About the Role
            </h3>
            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap mb-8">
              {job.description}
            </div>

            {job.skills && job.skills.length > 0 && (
                <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
          </div>
          
           <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h4 className="font-bold text-indigo-900">Are you an admin for this job?</h4>
                        <p className="text-sm text-indigo-700 mt-1">Check the applications received so far.</p>
                    </div>
                    <Link 
                    to={`/jobs/${id}/applications`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition shadow-sm border border-indigo-200"
                    >
                    View Applications
                    <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
           </div>
        </div>

        {/* Application Form (Right Column - Sticky) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                Apply Now
            </h2>
            
            {!result ? (
              <form onSubmit={handleApply} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
                    placeholder="John Doe"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Request (PDF)</label>
                  <div className="group border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition relative">
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      accept=".pdf"
                      onChange={(e) => setResume(e.target.files[0])}
                      required
                    />
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                        <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap px-2">
                      {resume ? resume.name : "Click to browse"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PDF files only</p>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Analyzing..." : "Submit Application"}
                </button>
              </form>
            ) : (
              <div className={`text-center p-6 rounded-xl animate-fade-in ${result.eligible ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${result.eligible ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                    {result.eligible ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                </div>
                
                <h3 className={`text-lg font-bold mb-2 ${result.eligible ? "text-green-800" : "text-red-800"}`}>
                  {result.eligible ? "Excellent Match!" : "Not a Match"}
                </h3>
                
                <p className={`text-sm mb-4 ${result.eligible ? "text-green-700" : "text-red-700"}`}>{result.message}</p>
                
                <div className="inline-block bg-white px-4 py-2 rounded-lg shadow-sm font-mono text-xl font-bold text-gray-800 border mb-4">
                  {result.ats_score}%
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-6">ATS Score</div>
                
                <button 
                  onClick={() => { setResult(null); setResume(null); setCandidateName(""); }}
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 underline"
                >
                  Submit another application
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
