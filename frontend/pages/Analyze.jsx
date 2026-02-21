import {
  Upload,
  FileText,
  AlertCircle,
  Check,
  Briefcase,
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Analyze() {
  const API_BASE = "http://127.0.0.1:8000";

  const [resume, setResume] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleAnalyze = async () => {
    if (!resume) return;

    setLoading(true);
    setResults(null);

    try {
      // 1. Upload and Extract Text
      const uploadData = new FormData();
      uploadData.append("resume", resume);

      const uploadRes = await fetch(`${API_BASE}/api/ats/upload/`, {
        method: "POST",
        body: uploadData,
      });

      const uploadJson = await uploadRes.json();

      // 2. Rank against all jobs
      const rankRes = await fetch(`${API_BASE}/api/ats/rank-jobs/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text: uploadJson.text_preview,
        }),
      });

      const rankJson = await rankRes.json();
      setResults(rankJson);
    } catch (err) {
      console.error(err);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-100";
    if (score >= 60) return "text-blue-600 bg-blue-50 border-blue-100";
    if (score >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-100";
    return "text-red-600 bg-red-50 border-red-100";
  };

  return (
    <section className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Job Match
          </h1>
          <p className="text-gray-600">
            Upload your resume to see which open positions you are most compatible with.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm max-w-2xl mx-auto mb-12">
            <div
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                setResume(e.dataTransfer.files[0]);
            }}
            onClick={() => document.getElementById("resume-upload").click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition
                ${
                isDragging
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                }`}
            >
            {resume ? (
                <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-lg font-medium text-gray-900">{resume.name}</p>
                <p className="text-sm text-gray-500">Tap to replace</p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                    <Upload className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-lg font-medium text-gray-700">
                    Drop your resume here
                </p>
                <p className="text-sm text-gray-500">
                    or click to browse PDF/DOCX
                </p>
                </div>
            )}

            <input
                id="resume-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files[0])}
            />
            </div>

            <button
            onClick={handleAnalyze}
            disabled={!resume || loading}
            className="w-full mt-6 py-4 rounded-xl font-bold text-lg shadow-lg transition
                bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {loading ? "Matching Jobs..." : "Find Matches"}
            </button>
        </div>

        {/* Results Section */}
        {loading && (
             <div className="text-center py-12">
                <div className="w-12 h-12 mx-auto mb-4 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-lg text-gray-600 font-medium">Analyzing your resume against active jobs...</p>
             </div>
        )}

        {!loading && results && (
            <div className="animate-fade-in space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Matches for You</h2>
                
                {results.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                        <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 text-lg">No jobs found matching your profile.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {results.map((job) => (
                            <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                                    <p className="text-gray-500 font-medium flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        {job.company}
                                    </p>
                                </div>

                                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className={`px-4 py-2 rounded-lg border flex flex-col items-center ${getScoreColor(job.score)}`}>
                                        <span className="text-2xl font-bold">{job.score}%</span>
                                        <span className="text-xs uppercase font-bold tracking-wider">Match</span>
                                    </div>
                                    
                                    <Link 
                                        to={`/jobs/${job.id}`}
                                        className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition shadow-md"
                                        title="View Job"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

      </div>
    </section>
  );
}
