import { Upload, FileText, Users, Trophy } from "lucide-react";
import { useState } from "react";

export default function Rank() {
  const API_BASE = "https://resume-ranker-backend-esei.onrender.com";
  // const API_BASE = "http://127.0.0.1:8000/";

  const [files, setFiles] = useState([]);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };
  const handleRank = async () => {
    if (!files.length || !jobDesc) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    files.forEach((file) => formData.append("resumes", file));
    formData.append("job_desc", jobDesc);

    try {
      const res = await fetch(`${API_BASE}/api/ats/rank/`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data.ranked_candidates);
    } catch (err) {
      console.error(err);
      alert("Ranking failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Resume Ranking</h1>
          <p className="text-gray-600">
            Upload multiple resumes and rank candidates based on job fit
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3 font-medium text-sm">
                <Users className="w-4 h-4 text-indigo-600" />
                Upload Resumes (Multiple)
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("multi-upload").click()}
                className={`
                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
                ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-100"
                    : "border-indigo-300 bg-indigo-50"
                }
              `}
              >
                {files.length ? (
                  <div>
                    <FileText className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
                    <p className="font-medium">{files.length} files selected</p>
                    <p className="text-xs text-gray-500">
                      Click to change selection
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 mx-auto mb-2 text-indigo-400" />
                    <p>Drop resumes here or click to browse</p>
                    <p className="text-xs text-gray-400">
                      Select multiple PDF, DOC, DOCX files
                    </p>
                  </div>
                )}

                <input
                  id="multi-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3 font-medium text-sm">
                <FileText className="w-4 h-4 text-indigo-600" />
                Job Description
              </div>

              <textarea
                rows={6}
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full rounded-xl border border-gray-200 p-4"
              />
            </div>
            <button
              onClick={handleRank}
              disabled={!files.length || !jobDesc || loading}
              className={`
    w-full py-4 rounded-xl font-semibold transition shadow-md
    ${
      !files.length || !jobDesc || loading
        ? "bg-indigo-300 text-white cursor-not-allowed"
        : "bg-indigo-600 text-white hover:bg-indigo-700"
    }
  `}
            >
              {loading ? "Ranking..." : "Rank Candidates"}
            </button>
          </div>

          <div className=" rounded-xl p-6 flex justify-center">
            {!result && !loading && (
              <div className="text-center text-gray-400">
                <Users className="w-10 h-10 mx-auto mb-4" />
                <p className="font-medium">No Rankings Yet</p>
                <p className="text-sm">
                  Upload resumes and a job description to rank candidates
                </p>
              </div>
            )}

            {loading && <p className="text-indigo-600">Ranking resumes...</p>}

            {result && (
              <div className="w-full space-y-4">
                {result.map((r, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl flex items-center gap-4 ${
                      i === 0
                        ? "bg-yellow-50 border border-yellow-200"
                        : "bg-gray-100"
                    }`}
                  >
                    {i === 0 ? (
                      <Trophy className="text-yellow-500" />
                    ) : (
                      <Users className="text-gray-400" />
                    )}

                    <div className="flex-1">
                      <p className="font-medium truncate">
                        {r.filename.replace(/\.[^/.]+$/, "")}
                      </p>
                      <p className="text-xs text-gray-500">Rank #{i + 1}</p>
                    </div>

                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500"
                        style={{ width: `${r.ats_score}%` }}
                      />
                    </div>

                    <p className="font-semibold">{r.ats_score}%</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}