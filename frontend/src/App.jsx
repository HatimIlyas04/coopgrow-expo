import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Stands from "./pages/Stands";
import StandDetails from "./pages/StandDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import CoopDashboard from "./pages/CoopDashboard";
import AdminDashboard from "./pages/AdminDashboard";


export default function App() {
  // ✅ Wake up backend (Render free)
  useEffect(() => {
    fetch(API)
      .then(() => console.log("✅ Backend woke up"))
      .catch(() => console.log("❌ Backend not ready yet"));
  }, []);
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stands" element={<Stands />} />
        <Route path="/stands/:id" element={<StandDetails />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/coop" element={<CoopDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
