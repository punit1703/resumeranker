import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Download, ArrowLeft, User } from "lucide-react";

export default function JobApplications() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/ats/jobs/${id}/applications/`)
      .then((res) => {
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

  if (loading) return <div className="text-center py-10">Loading applications...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <section className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
            <Link to={`/jobs/${id}`} className="p-2 hover:bg-gray-200 rounded-full transition">
                <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold">Job Applications</h1>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No applications yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-xl shadow flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{app.candidate_name}</h3>
                  <p className="text-sm text-gray-500">Applied: {new Date(app.applied_at).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <span className={`block text-xl font-bold ${app.ats_score >= 50 ? 'text-green-600' : 'text-orange-500'}`}>
                            {app.ats_score}%
                        </span>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">ATS Score</span>
                    </div>
                    
                    {app.resume_url && (
                        <a 
                            href={app.resume_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
                            title="Download Resume"
                        >
                            <Download className="w-5 h-5" />
                        </a>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
