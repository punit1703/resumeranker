import {
  User,
  Mail,
  FileText,
  GraduationCap,
  Briefcase,
  Download,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
function Input({ icon: Icon, label, ...props }) {
  return (
    <div>
      <label className="flex items-center gap-2 mb-2 text-sm font-medium">
        <Icon className="w-4 h-4 text-indigo-600" />
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-xl bg-gray-100 p-4 border border-gray-200"
      />
    </div>
  );
}

function Textarea({ icon: Icon, label, ...props }) {
  return (
    <div>
      <label className="flex items-center gap-2 mb-2 text-sm font-medium">
        <Icon className="w-4 h-4 text-indigo-600" />
        {label}
      </label>
      <textarea
        rows={4}
        {...props}
        className="w-full rounded-xl bg-gray-100 p-4 border border-gray-200"
      />
    </div>
  );
}

export default function Generate() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    skills: "",
    education: "",
    experience: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleGenerate = async () => {
    if (!form.name) {
      alert("Name is required");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/ats/generate-resume/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

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
    <section className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Resume Generator</h1>
          <p className="text-gray-600">
            Generate an ATS-optimized resume from your information
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
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

          <Textarea
            icon={FileText}
            label="Skills"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="Python, Machine Learning, SQL, Docker..."
          />
          <Textarea
            icon={GraduationCap}
            label="Education"
            name="education"
            value={form.education}
            onChange={handleChange}
            placeholder="B.Tech in Computer Engineering, XYZ University"
          />
          <Textarea
            icon={Briefcase}
            label="Experience"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            placeholder="Software Engineering Intern at ABC Corp..."
          />

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
              {loading ? "Generating..." : "Generate ATS-Friendly Resume"}
            </button>

            {pdfUrl && (
              <a
                href={pdfUrl}
                download="ATS_Resume.pdf"
                className="flex-1 py-4 rounded-xl border border-indigo-200 font-semibold flex items-center justify-center gap-2 hover:bg-indigo-50"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </a>
            )}
          </div>

          {success && (
  <div className="mt-6 flex gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700">
    <CheckCircle className="w-5 h-5 mt-0.5 text-green-600" />

    <div>
      <p className="font-medium">Resume Generated Successfully!</p>
      <p className="text-sm">
        Your ATS-optimized resume is ready. Click the download button to save it.
      </p>
    </div>
  </div>
)}
        </div>
      </div>
    </section>
  );
}
