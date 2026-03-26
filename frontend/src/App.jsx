import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Landing from "../pages/Landing";
import RoleSelect from "../pages/RoleSelect";
import Analyze from "../pages/Analyze";
import Rank from "../pages/Rank";
import Generate from "../pages/Generate";
import EmployerDashboard from "../pages/EmployerDashboard";
import Footer from "../components/Footer";
import Jobs from "../pages/Jobs";
import JobDetails from "../pages/JobDetails";
import CreateJob from "../pages/CreateJob";
import JobApplications from "../pages/JobApplications";
import Login from "../pages/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  const location = useLocation();
  const PublicRoutes = ["/", "/role-select", "/login"];
  const isPublicRoute = PublicRoutes.includes(location.pathname);

  return (
    <div className={`min-h-screen ${isPublicRoute ? 'bg-slate-950' : 'bg-gray-100'}`}>
      <AuthProvider>
        <Navbar />

        <main className={isPublicRoute ? "" : "pt-24 pb-10"}>
          <Routes>
            <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="/role-select" element={<PublicRoute><RoleSelect /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

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
              path="/employer/applications"
              element={
                <ProtectedRoute allowedRoles={["company"]}>
                  <EmployerDashboard />
                </ProtectedRoute>
              }
            />
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
            <Route
              path="/generate"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <Generate />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </div>
  );
}
