import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Analyze from "../pages/Analyze";
import Rank from "../pages/Rank";
import Generate from "../pages/Generate";
import Footer from "../components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mt-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/rank" element={<Rank />} />
          <Route path="/generate" element={<Generate />} />
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}
