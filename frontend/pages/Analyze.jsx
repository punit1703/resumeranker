import { Upload, FileText, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function Analyze() {
  const [resume, setResume] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleAnalyze = async () => {
    if (!resume || !jobDesc) {
      alert("Please upload resume and job description");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const uploadData = new FormData();
      uploadData.append("resume", resume);

      const uploadRes = await fetch("http://127.0.0.1:8000/api/ats/upload/", {
        method: "POST",
        body: uploadData,
      });

      const uploadJson = await uploadRes.json();

      if (!uploadJson.text_preview) {
        throw new Error("Resume text extraction failed");
      }

      const scoreRes = await fetch("http://127.0.0.1:8000/api/ats/score/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_text: uploadJson.text_preview,
          job_desc: jobDesc,
        }),
      });

      const scoreJson = await scoreRes.json();
      setResult(scoreJson);
    } catch (err) {
      console.error(err);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const getMatchLabel = (score) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Average Match";
    return "Poor Match";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setResume(file);
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resume Analysis
          </h1>
          <p className="text-gray-600">
            Upload your resume and job description to get an ATS compatibility
            score
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-sm font-medium">
                <Upload className="w-4 h-4 text-indigo-600" />
                Upload Resume
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("resume-upload").click()}
                className={`
    border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
    transition block
    ${
      isDragging
        ? "border-indigo-500 bg-indigo-100"
        : "border-indigo-300 bg-indigo-50/40 hover:border-indigo-400"
    }
  `}
              >
                {resume ? (
                  <div className="flex flex-col items-center justify-center text-indigo-600">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                      ✓
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {resume.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Click to replace
                    </p>
                  </div>
                ) : (
                  <div>
                    <FileText className="w-8 h-8 mx-auto mb-3 text-indigo-400" />
                    <p className="text-sm text-gray-600">
                      Drop your resume here or click to browse
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PDF, DOC, DOCX up to 10MB
                    </p>
                  </div>
                )}

                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-sm font-medium">
                <FileText className="w-4 h-4 text-indigo-600" />
                Job Description
              </div>

              <textarea
                rows={6}
                placeholder="Paste the job description here..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-4"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!resume || !jobDesc || loading}
              className={`
    w-full py-4 rounded-xl font-semibold transition shadow-md
    ${
      !resume || !jobDesc || loading
        ? "bg-indigo-300 text-white cursor-not-allowed"
        : "bg-indigo-600 text-white hover:bg-indigo-700"
    }
  `}
            >
              {loading ? "Analyzing..." : "Get ATS Score"}
            </button>
          </div>

          <div className="bg-white rounded-2xl p-10 shadow-sm flex items-center justify-center text-center">
            {loading && (
              <div className="text-indigo-600">
                <div className="w-10 h-10 mx-auto mb-4 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-sm font-medium">Analyzing resume...</p>
              </div>
            )}

            {!loading && !result && (
              <div className="text-gray-400">
                <AlertCircle className="w-10 h-10 mx-auto mb-4" />
                <h3 className="font-medium mb-1">No Analysis Yet</h3>
                <p className="text-sm">
                  Upload a resume and paste a job description to see your ATS
                  compatibility score
                </p>
              </div>
            )}

            {!loading && result && (
              <div className="space-y-6 w-full animate-fade-in">
                <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-6">
                  <div className="relative w-28 h-28">
                    <svg className="w-full h-full rotate-[-90deg]">
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        stroke="#14b8a6"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 48}
                        strokeDashoffset={
                          2 * Math.PI * 48 * (1 - result.ats_score / 100)
                        }
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-teal-600">
                      {result.ats_score}%
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      ATS Compatibility Score
                    </p>
                    <h3 className="text-lg font-semibold">
                      {getMatchLabel(result.ats_score)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Your resume matches {result.ats_score}% of the job
                      requirements
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    ⚠️ Missing Skills
                  </h4>

                  <div className="flex flex-wrap gap-3">
                    {result.missing_skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-4 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm animate-pop"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    💡 Improvement Suggestions
                  </h4>

                  <ul className="space-y-3 text-sm text-gray-600">
                    {result.suggestions.map((s, i) => (
                      <li
                        key={i}
                        className="flex gap-2 animate-slide-up"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <span className="text-indigo-500">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
