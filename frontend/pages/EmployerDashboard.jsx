import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Users, ArrowRight } from "lucide-react";
import { useAuth } from "../src/context/AuthContext";

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://resume-ranker-backend-esei.onrender.com/api/ats/jobs/?my_jobs=true", {
        headers: { "Authorization": `Token ${token}` }
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
            logout();
            navigate("/login?role=employer");
            throw new Error("Unauthorized");
        }
        if (!res.ok) throw new Error("Failed to fetch jobs");
        return res.json();
      })
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen py-20 text-indigo-600 font-semibold animate-pulse">Loading Your Jobs...</div>;
  if (error) return <div className="text-center py-20 text-rose-500 font-semibold">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">My Postings</h1>
          <p className="text-lg text-slate-500">Manage your active job listings and review incoming candidate applications.</p>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200">
            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Jobs Posted Yet</h3>
            <p className="text-slate-500 mb-6">Create a job posting to start receiving applications.</p>
            <Link to="/create-job" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-900/10">
              Create New Job
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition flex flex-col group relative">
                <div className="flex justify-between items-start mb-5">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200">
                    Min Score: {job.min_score_required}%
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{job.title}</h3>
                <p className="text-sm font-medium text-slate-500 mb-6">{job.company}</p>
                
                <div className="mt-auto flex flex-col gap-3 pt-5 border-t border-slate-100">
                    <Link 
                        to={`/jobs/${job.id}/applications`} 
                        className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 hover:text-indigo-800 transition shadow-sm active:scale-[0.98]"
                    >
                        <Users className="w-5 h-5" /> View Applications <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
