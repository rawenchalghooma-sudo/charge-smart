import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  History,
  CalendarDays,
  MapPin,
  Bolt,
  Clock3,
  Wallet,
  CheckCircle2,
  XCircle,
  LogOut,
  AlertTriangle,
  Loader2,
  Car,
} from "lucide-react";

type BackendStation = {
  id: number;
  name: string;
  address?: string;
  location?: string;
};

type BackendReservation = {
  id: number | string;
  reservationDate?: string;
  startTime?: string;
  endTime?: string;
  estimatedKwh?: number;
  estimatedCost?: number;
  vehicleType?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  Station?: BackendStation;
  stationId?: number;
  createdAt?: string;
};

type HistoryItem = {
  id: string;
  stationName: string;
  location: string;
  date: string;
  time: string;
  duration: string;
  energy: string;
  cost: string;
  vehicleType: string;
  type: "Réservation";
  rawStatus: "pending" | "confirmed" | "cancelled" | "completed";
  status: "Confirmée" | "Annulée" | "Terminée" | "En attente";
};

function getAuthToken() {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    localStorage.getItem("user_token") ||
    sessionStorage.getItem("user_token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("jwt") ||
    sessionStorage.getItem("jwt")
  );
}

function formatDate(dateString?: string) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("fr-FR");
}

function formatTime(dateString?: string) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(start?: string, end?: string) {
  if (!start || !end) return "—";

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "—";
  }

  const diffMs = endDate.getTime() - startDate.getTime();
  if (diffMs <= 0) return "00h00";

  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}h${String(minutes).padStart(2, "0")}`;
}

function mapStatus(status: BackendReservation["status"]): HistoryItem["status"] {
  if (status === "completed") return "Terminée";
  if (status === "confirmed") return "Confirmée";
  if (status === "cancelled") return "Annulée";
  return "En attente";
}

function statusBadge(status: HistoryItem["status"]) {
  if (status === "Terminée") return "bg-emerald-100 text-emerald-700";
  if (status === "Confirmée") return "bg-blue-100 text-blue-700";
  if (status === "En attente") return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
}

function typeBadge(type: HistoryItem["type"]) {
  if (type === "Réservation") return "bg-slate-100 text-slate-700";
  return "bg-amber-100 text-amber-700";
}

export default function UserHistory() {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState<BackendReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoadingId, setCancelLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/user/login");
  };

  useEffect(() => {
    const fetchReservations = async () => {
      const token = getAuthToken();

      if (!token) {
        setError("Session expirée. Veuillez vous reconnecter.");
        setLoading(false);
        navigate("/user/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:5000/api/reservations/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const rawText = await response.text();
        const data = rawText ? JSON.parse(rawText) : [];

        if (!response.ok) {
          throw new Error(data.message || "Impossible de charger l’historique.");
        }

        setReservations(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Erreur chargement historique :", err);
        setError(err.message || "Impossible de charger l’historique.");
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [navigate]);

  const historyItems: HistoryItem[] = useMemo(() => {
    return reservations.map((item) => ({
      id: String(item.id),
      stationName: item.Station?.name || `Station #${item.stationId ?? "—"}`,
      location: item.Station?.address || item.Station?.location || "Localisation non disponible",
      date: formatDate(item.reservationDate || item.startTime),
      time: formatTime(item.startTime),
      duration: formatDuration(item.startTime, item.endTime),
      energy: `${(item.estimatedKwh ?? 0).toFixed(1)} kWh`,
      cost: `${(item.estimatedCost ?? 0).toFixed(2)} DT`,
      vehicleType: item.vehicleType || "Non précisé",
      type: "Réservation",
      rawStatus: item.status,
      status: mapStatus(item.status),
    }));
  }, [reservations]);

  const handleCancelReservation = async (reservationId: string) => {
    const token = getAuthToken();

    if (!token) {
      setError("Session expirée. Veuillez vous reconnecter.");
      navigate("/user/login");
      return;
    }

    try {
      setCancelLoadingId(reservationId);
      setError(null);

      const response = await fetch(
        `http://localhost:5000/api/reservations/${reservationId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const rawText = await response.text();
      const data = rawText ? JSON.parse(rawText) : {};

      if (!response.ok) {
        throw new Error(data.message || "Impossible d’annuler la réservation.");
      }

      setReservations((prev) =>
        prev.map((reservation) =>
          String(reservation.id) === reservationId
            ? { ...reservation, status: "cancelled" }
            : reservation
        )
      );
    } catch (err: any) {
      console.error("Erreur annulation réservation :", err);
      setError(err.message || "Erreur lors de l’annulation.");
    } finally {
      setCancelLoadingId(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[12%] -left-[10%] h-[40%] w-[40%] rounded-full bg-amber-200/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[12%] h-[40%] w-[40%] rounded-full bg-emerald-200/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[35%] h-[40%] w-[40%] rounded-full bg-blue-200/20 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/user/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Retour dashboard
            </Link>

            <div>
              <div className="text-sm font-bold text-slate-900">Historique utilisateur</div>
              <div className="text-xs text-slate-500">
                Réservations précédentes
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              <History size={14} />
              Historique
            </span>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">Mes activités</h1>
          <p className="mt-2 text-sm text-slate-500">
            Consultez ici vos réservations enregistrées depuis votre compte conducteur.
          </p>
        </div>

        {loading && (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-slate-700">
              <Loader2 className="h-5 w-5 animate-spin" />
              Chargement de l’historique...
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="mt-6 rounded-3xl border border-rose-100 bg-rose-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 text-sm font-semibold text-rose-700">
              <AlertTriangle size={18} />
              {error}
            </div>
          </div>
        )}

        {!loading && !error && historyItems.length === 0 && (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="text-lg font-black text-slate-900">Aucun historique pour le moment</div>
            <p className="mt-2 text-sm text-slate-500">
              Vous n’avez pas encore de réservation enregistrée.
            </p>
          </div>
        )}

        {!loading && !error && historyItems.length > 0 && (
          <div className="mt-6 grid gap-4">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-black text-slate-900">{item.stationName}</h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${typeBadge(item.type)}`}
                      >
                        {item.type}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadge(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                      <MapPin size={15} />
                      {item.location}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {item.status === "Terminée" && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                        <CheckCircle2 size={14} />
                        Réservation terminée
                      </span>
                    )}

                    {item.status === "Annulée" && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                        <XCircle size={14} />
                        Réservation annulée
                      </span>
                    )}

                    {(item.rawStatus === "pending" || item.rawStatus === "confirmed") && (
                      <button
                        onClick={() => handleCancelReservation(item.id)}
                        disabled={cancelLoadingId === item.id}
                        className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-70"
                      >
                        {cancelLoadingId === item.id ? "Annulation..." : "Annuler"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                  <InfoBox
                    icon={<CalendarDays size={16} />}
                    label="Date"
                    value={`${item.date} • ${item.time}`}
                  />
                  <InfoBox
                    icon={<Clock3 size={16} />}
                    label="Durée"
                    value={item.duration}
                  />
                  <InfoBox
                    icon={<Bolt size={16} />}
                    label="Énergie estimée"
                    value={item.energy}
                  />
                  <InfoBox
                    icon={<Wallet size={16} />}
                    label="Coût estimé"
                    value={item.cost}
                  />
                  <InfoBox
                    icon={<Car size={16} />}
                    label="Type voiture"
                    value={item.vehicleType}
                  />
                  <InfoBox
                    icon={<History size={16} />}
                    label="Statut"
                    value={item.status}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-sm font-black text-slate-900">{value}</div>
    </div>
  );
}