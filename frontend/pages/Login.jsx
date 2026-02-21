import { useAuth } from "../src/context/AuthContext";
import { Briefcase, User } from "lucide-react";

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome Back</h1>
        <p className="text-gray-500 mb-8">Select your role to continue</p>

        <div className="space-y-4">
          <button
            onClick={() => login("candidate")}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 transition group"
          >
            <div className="bg-indigo-100 p-3 rounded-full group-hover:bg-indigo-500 group-hover:text-white transition">
              <User className="w-6 h-6 text-indigo-600 group-hover:text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-700 group-hover:text-indigo-700">
              I am a Candidate
            </span>
          </button>

          <button
            onClick={() => login("company")}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-teal-100 hover:border-teal-500 hover:bg-teal-50 transition group"
          >
            <div className="bg-teal-100 p-3 rounded-full group-hover:bg-teal-500 group-hover:text-white transition">
              <Briefcase className="w-6 h-6 text-teal-600 group-hover:text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-700 group-hover:text-teal-700">
              I am an Employer
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
