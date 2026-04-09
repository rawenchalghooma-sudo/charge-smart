import { Routes, Route, Navigate, Link } from "react-router-dom";

/* HOME */
import Home from "./pages/Home";
import LoginSelector from "./pages/LoginSelector";
import Signup from "./pages/Signup";

/* USER */
import UserLogin from "./pages/user/UserLogin";
import UserDashboard from "./pages/user/UserDashboard";
import PlugDetails from "./pages/user/PlugDetails";
import ReservationPage from "./pages/user/ReservationPage";
import ChargingSession from "./pages/user/ChargingSession";
import UserHistory from "./pages/user/UserHistory";
import UserProfile from "./pages/user/UserProfile";

/* OWNER */
import OwnerLogin from "./pages/owner/OwnerLogin";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import StationsManagement from "./pages/owner/StationsManagement";
import StationDetails from "./pages/owner/StationDetails";
import ReservationsManagement from "./pages/owner/ReservationsManagement";
import ChargingSessionsManagement from "./pages/owner/ChargingSessionsManagement";
import EnergyMonitoring from "./pages/owner/EnergyMonitoring";

/* ADMIN */
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import SystemMonitoring from "./pages/admin/SystemMonitoring";

/* PAGE 404 */
function NotFound() {
  return (
    <div className="min-h-screen bg-[#f5f9ff] flex items-center justify-center p-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">404</h1>

        <p className="mt-2 text-slate-600">Page non trouvée</p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<LoginSelector />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/user/history" element={<UserHistory />} />
      <Route path="/user/profile" element={<UserProfile />} />
      <Route path="/user/plug/:id" element={<PlugDetails />} />
      <Route path="/user/reserve/:id" element={<ReservationPage />} />
      <Route path="/user/session/:id" element={<ChargingSession />} />
      <Route path="/user" element={<Navigate to="/user/login" replace />} />

      <Route path="/owner/login" element={<OwnerLogin />} />
      <Route path="/owner/dashboard" element={<OwnerDashboard />} />
      <Route path="/owner/stations" element={<StationsManagement />} />
      <Route path="/owner/station/:id" element={<StationDetails />} />
      <Route path="/owner/reservations" element={<ReservationsManagement />} />
      <Route path="/owner/sessions" element={<ChargingSessionsManagement />} />
      <Route path="/owner/energy" element={<EnergyMonitoring />} />
      <Route path="/owner" element={<Navigate to="/owner/login" replace />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UsersManagement />} />
      <Route path="/admin/system" element={<SystemMonitoring />} />
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}