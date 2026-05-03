import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock3,
  MapPin,
  User,
  ArrowLeft,
  LogOut,
  QrCode,
  Zap,
} from "lucide-react";

type ReservationStatus = "Confirmée" | "En attente" | "Annulée" | "Terminée";

type ReservationApiStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | string;

type ReservationApi = {
  id: number;
  reservationDate: string;
  startTime: string;
  endTime: string;
  status: ReservationApiStatus;
  estimatedKwh?: number;
  estimatedCost?: number;
  vehicleType?: string;
  qrCodeId?: string;
  User?: {
    id?: number;
    fullName?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  Station?: {
    id?: number;
    name?: string;
    address?: string;
    city?: string;
    status?: string;
  };
};

type Reservation = {
  id: number;
  userName: string;
  station: string;
  date: string;
  time: string;
  duration: string;
  status: ReservationStatus;
  qrCodeId: string;
  urgency: number;
};

function formatStatus(status: ReservationApiStatus): ReservationStatus {
  if (status === "confirmed") return "Confirmée";
  if (status === "pending")   return "En attente";
  if (status === "cancelled") return "Annulée";
  return "Terminée";
}

function getStatusClass(status: ReservationStatus) {
  if (status === "Confirmée")  return "bg-emerald-50 text-emerald-600";
  if (status === "En attente") return "bg-amber-50 text-amber-600";
  if (status === "Annulée")    return "bg-rose-50 text-rose-600";
  return "bg-slate-100 text-slate-600";
}

function getUrgencyStyle(score: number) {
  if (score >= 85) return { color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",    label: "CRITIQUE"    };
  if (score >= 65) return { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", label: "HAUTE"       };
  if (score >= 40) return { color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200", label: "MOYENNE"     };
  if (score >= 20) return { color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   label: "FAIBLE"      };
  return               { color: "text-slate-600",  bg: "bg-slate-50",  border: "border-slate-200",  label: "TRÈS FAIBLE" };
}

function getUserDisplayName(user?: ReservationApi["User"]) {
  if (!user) return "Utilisateur";
  if (user.fullName) return user.fullName;
  if (user.name) return user.name;
  if (user.firstName || user.lastName)
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  if (user.email) return user.email;
  return "Utilisateur";
}

function formatStationName(station?: ReservationApi["Station"]) {
  if (!station) return "Borne non renseignée";
  if (station.name) return station.name;
  return [station.address, station.city].filter(Boolean).join(" - ") || "Borne";
}

function formatDuration(startTime?: string, endTime?: string) {
  if (!startTime || !endTime) return "Non renseignée";
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute]     = endTime.split(":").map(Number);
  if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute))
    return "Non renseignée";
  const diff = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  if (diff <= 0) return "Non renseignée";
  return `${diff} min`;
}

function formatDate(date: string) {
  if (!date) return "Date inconnue";
  return date;
}

// Parser le QR : "ID:18 | URGENCY:85" → urgency = 85
function parseUrgencyFromQr(qrCodeId?: string): number {
  if (!qrCodeId) return 0;
  const match = qrCodeId.match(/URGENCY:(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function mapReservation(apiReservation: ReservationApi): Reservation {
  const qrCodeId = apiReservation.qrCodeId || `ID:${apiReservation.id} | URGENCY:5`;
  return {
    id:       apiReservation.id,
    userName: getUserDisplayName(apiReservation.User),
    station:  formatStationName(apiReservation.Station),
    date:     formatDate(apiReservation.reservationDate),
    time:     apiReservation.startTime || "--:--",
    duration: formatDuration(apiReservation.startTime, apiReservation.endTime),
    status:   formatStatus(apiReservation.status),
    qrCodeId,
    urgency:  parseUrgencyFromQr(apiReservation.qrCodeId),
  };
}

// ── Carte réservation ──
function ReservationCard({
  reservation,
  onConfirm,
  onCancel,
  actionLoadingId,
}: {
  reservation: Reservation;
  onConfirm: (id: number) => void;
  onCancel: (id: number) => void;
  actionLoadingId: number | null;
}) {
  const isLoading     = actionLoadingId === reservation.id;
  const urgencyStyle  = getUrgencyStyle(reservation.urgency);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

        {/* ── Infos principales ── */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900">
              {reservation.userName}
            </h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(reservation.status)}`}
            >
              {reservation.status}
            </span>
          </div>

          <div className="mt-3 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <MapPin size={15} />
              <span>{reservation.station}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays size={15} />
              <span>{reservation.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock3 size={15} />
              <span>{reservation.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={15} />
              <span>Durée : {reservation.duration}</span>
            </div>
          </div>

          {/* ── Badge QR + Urgency ── */}
          <div className="mt-4 flex flex-wrap items-center gap-3">

            {/* QR code complet */}
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <QrCode size={14} className="text-slate-500" />
              <span className="text-xs font-bold text-slate-700">
                {reservation.qrCodeId}
              </span>
            </div>

            {/* Urgency colorée */}
            <div
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 ${urgencyStyle.bg} ${urgencyStyle.border}`}
            >
              <Zap size={14} className={urgencyStyle.color} />
              <span className={`text-xs font-bold ${urgencyStyle.color}`}>
                Urgency : {reservation.urgency}/100 — {urgencyStyle.label}
              </span>
            </div>

          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isLoading || reservation.status === "Confirmée"}
            onClick={() => onConfirm(reservation.id)}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CheckCircle2 size={16} />
            Confirmer
          </button>

          <button
            type="button"
            disabled={isLoading || reservation.status === "Annulée"}
            onClick={() => onCancel(reservation.id)}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <XCircle size={16} />
            Annuler
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Page principale ──
export default function ReservationsManagement() {
  const navigate = useNavigate();

  const [reservations,    setReservations]    = useState<Reservation[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [searchTerm,      setSearchTerm]      = useState("");
  const [selectedDate,    setSelectedDate]    = useState("");

  const token =
    localStorage.getItem("token")       ||
    localStorage.getItem("owner_token") ||
    sessionStorage.getItem("token")     ||
    sessionStorage.getItem("owner_token");

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/owner/login");
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/reservations/owner/all",
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) throw new Error("Erreur lors du chargement des réservations");

      const data: ReservationApi[] = await response.json();
      setReservations(data.map(mapReservation));
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les réservations du propriétaire.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReservations(); }, []);

  const handleConfirm = async (id: number) => {
    try {
      setActionLoadingId(id);
      const response = await fetch(
        `http://localhost:5000/api/reservations/owner/${id}/confirm`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (!response.ok) throw new Error("Erreur lors de la confirmation");
      await fetchReservations();
    } catch (err) {
      console.error(err);
      alert("Impossible de confirmer la réservation.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      setActionLoadingId(id);
      const response = await fetch(
        `http://localhost:5000/api/reservations/owner/${id}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (!response.ok) throw new Error("Erreur lors de l'annulation");
      await fetchReservations();
    } catch (err) {
      console.error(err);
      alert("Impossible d'annuler la réservation.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      const matchesSearch =
        r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.station.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = !selectedDate || r.date.slice(0, 10) === selectedDate;
      return matchesSearch && matchesDate;
    });
  }, [reservations, searchTerm, selectedDate]);

  const todayCount = reservations.filter(
    (r) => r.date.slice(0, 10) === new Date().toISOString().slice(0, 10)
  ).length;

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CalendarDays size={20} />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900">Gestion des réservations</h1>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">Espace propriétaire</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/owner/dashboard")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Retour dashboard
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">

        {/* ── Titre ── */}
        <section className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Réservations des utilisateurs
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Consultez, filtrez et gérez les créneaux de réservation des bornes.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {todayCount} réservation{todayCount > 1 ? "s" : ""} aujourd'hui
          </div>
        </section>

        {/* ── Filtres ── */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-4">
            <div className="relative lg:col-span-2">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par utilisateur ou borne..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-300 focus:bg-white"
              />
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
            />

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Filter size={16} />
              Filtrer
            </button>
          </div>
        </section>

        {/* ── Liste ── */}
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Chargement des réservations...</h3>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center shadow-sm">
            <h3 className="text-lg font-bold text-rose-600">{error}</h3>
          </div>
        ) : (
          <section className="grid gap-6">
            {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                  actionLoadingId={actionLoadingId}
                />
              ))
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">Aucune réservation trouvée</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Essaie de modifier la recherche ou la date sélectionnée.
                </p>
              </div>
            )}
          </section>
        )}

      </main>
    </div>
  );
}