import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Analyze from "../pages/Analyze";
import Rank from "../pages/Rank";
import Generate from "../pages/Generate";
import Footer from "../components/Footer";
import Jobs from "../pages/Jobs";
import JobDetails from "../pages/JobDetails";
import CreateJob from "../pages/CreateJob";
import JobApplications from "../pages/JobApplications";
import Login from "../pages/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AuthProvider>
        <Navbar />

        <main className="mt-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Candidate Routes */}
            <Route
              path="/analyze"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <Analyze />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <Jobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/:id"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <JobDetails />
                </ProtectedRoute>
              }
            />

            {/* Company Routes */}
            <Route
              path="/rank"
              element={
                <ProtectedRoute allowedRoles={["company"]}>
                  <Rank />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-job"
              element={
                <ProtectedRoute allowedRoles={["company"]}>
                  <CreateJob />
                </ProtectedRoute>
              }
            />
             <Route
              path="/jobs/:id/applications"
              element={
                <ProtectedRoute allowedRoles={["company"]}>
                  <JobApplications />
                </ProtectedRoute>
              }
            />

            {/* Shared/Public Routes */}
            <Route path="/generate" element={<Generate />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </div>
  );
}
